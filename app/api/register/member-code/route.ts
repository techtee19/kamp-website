import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { after, NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendEventMemberVerificationCode } from '@/lib/email'
import { classifyEmailFailure } from '@/lib/email-failure'
import {
  activateEventMemberChallenge,
  createMemberVerificationCode,
  recordEventMemberOtpAttempt,
  stageEventMemberChallenge,
} from '@/lib/event-member-verification'
import {
  accountSendLimit,
  accountSendWindow,
  minute,
  networkLimit,
  resendSeconds,
} from '@/lib/registration-limits'
import { getClientIp, rateLimitStatus } from '@/lib/ratelimit'
import { readJsonRequest, requestBodyErrorResponse } from '@/lib/request-body'
import { freshClient } from '@/sanity/lib/client'
import { EVENT_BY_ID_QUERY } from '@/sanity/lib/queries'
import { normalizeMemberId } from '@/lib/member-id'

export const runtime = 'nodejs'
export const maxDuration = 30

const schema = z.object({
  eventId: z.string().min(1).max(128),
  memberId: z.string().trim().min(5).max(64),
})

function limited(error: string, retryAfter: number) {
  return NextResponse.json(
    { error, retryAfter },
    {
      status: 429,
      headers: { 'Retry-After': String(retryAfter), 'Cache-Control': 'no-store' },
    }
  )
}

export async function POST(request: NextRequest) {
  let eventId: string | null = null
  try {
    const network = await rateLimitStatus(
      `event-otp-send:ip:${getClientIp(request)}`,
      networkLimit('EVENT_OTP_SEND_IP_LIMIT', 300),
      10 * minute
    )
    if (!network.allowed) {
      after(() => recordEventMemberOtpAttempt(null, 'rate_limited'))
      return limited(
        'Too many requests from this network. Please wait before trying again.',
        network.retryAfter
      )
    }
    const body = schema.safeParse(await readJsonRequest(request, 2048))
    if (!body.success)
      return NextResponse.json({ error: 'Enter a valid KAMP member ID.' }, { status: 400 })
    const normalized = normalizeMemberId(body.data.memberId)
    if (!freshClient)
      return NextResponse.json(
        { error: 'Event verification is temporarily unavailable.' },
        { status: 503 }
      )
    const event = await freshClient.fetch<{
      title?: string
      status?: string
      registrationClosed?: boolean
    } | null>(EVENT_BY_ID_QUERY, { id: body.data.eventId })
    if (!event || event.status === 'past' || event.registrationClosed) {
      return NextResponse.json(
        { error: 'Registration for this event is closed.' },
        { status: 409 }
      )
    }
    eventId = body.data.eventId
    const cooldown = await rateLimitStatus(
      `event-otp-cooldown:${normalized}`,
      1,
      resendSeconds * 1000
    )
    if (!cooldown.allowed) {
      after(() => recordEventMemberOtpAttempt(eventId, 'rate_limited'))
      return limited('Please wait before requesting another code.', cooldown.retryAfter)
    }
    const quota = await rateLimitStatus(
      `event-otp-send:account:${normalized}`,
      accountSendLimit,
      accountSendWindow
    )
    if (!quota.allowed) {
      after(() => recordEventMemberOtpAttempt(eventId, 'rate_limited'))
      return limited('Too many code requests. Please try again later.', quota.retryAfter)
    }

    const canResendAt = Date.now() + cooldown.retryAfter * 1000
    const response = (challengeId: string) =>
      NextResponse.json(
        {
          success: true,
          challengeId,
          retryAfter: Math.max(0, Math.ceil((canResendAt - Date.now()) / 1000)),
        },
        { headers: { 'Cache-Control': 'no-store' } }
      )
    const [member] = await db`
      SELECT member_id, first_name, email FROM members
      WHERE UPPER(member_id) = ${normalized} AND status = 'active' LIMIT 1
    `
    if (!member) {
      after(() => recordEventMemberOtpAttempt(eventId, 'member_not_found'))
      return response(randomUUID())
    }

    const challenge = createMemberVerificationCode()
    const memberId = String(member.member_id)
    await stageEventMemberChallenge(
      challenge.challengeId,
      eventId,
      memberId,
      challenge.codeHash
    )
    let messageId: string | null
    try {
      const sent = await sendEventMemberVerificationCode({
        to: String(member.email),
        firstName: String(member.first_name),
        code: challenge.code,
        eventTitle: event.title,
      })
      messageId = sent.data?.id ?? null
    } catch (error) {
      const failure = classifyEmailFailure(error)
      after(() => recordEventMemberOtpAttempt(eventId, 'email_rejected', null, failure.code))
      await db`DELETE FROM event_member_verifications WHERE challenge_id = ${challenge.challengeId}::uuid AND pending_delivery`
      // The same public reply protects membership privacy, including during a provider rejection.
      return response(randomUUID())
    }
    if (
      !(await activateEventMemberChallenge(
        challenge.challengeId,
        eventId,
        memberId,
        String(member.email)
      ))
    )
      return response(randomUUID())
    after(() => recordEventMemberOtpAttempt(eventId, 'email_accepted', messageId))
    return response(challenge.challengeId)
  } catch (error) {
    const bodyError = requestBodyErrorResponse(error)
    if (bodyError)
      return NextResponse.json({ error: bodyError.message }, { status: bodyError.status })
    after(() => recordEventMemberOtpAttempt(eventId, 'system_error'))
    return NextResponse.json(
      { error: 'Could not request a verification code. Please try again.' },
      { status: 500 }
    )
  }
}
