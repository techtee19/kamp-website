import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendEventMemberVerificationCode } from '@/lib/email'
import { createEventMemberChallenge, createMemberVerificationCode } from '@/lib/event-member-verification'
import { getClientIp, rateLimit } from '@/lib/ratelimit'
import { readJsonRequest, requestBodyErrorResponse } from '@/lib/request-body'
import { client } from '@/sanity/lib/client'
import { EVENT_BY_ID_QUERY } from '@/sanity/lib/queries'

export const runtime = 'nodejs'
const requestSchema = z.object({
  eventId: z.string().min(1).max(128),
  memberId: z.string().trim().min(5).max(64),
})

export async function POST(request: NextRequest) {
  try {
    const body = requestSchema.safeParse(await readJsonRequest(request, 2 * 1024))
    if (!body.success) return NextResponse.json({ error: 'Enter a valid KAMP member ID.' }, { status: 400 })

    const { eventId, memberId } = body.data
    if (!client) return NextResponse.json({ error: 'Member registration is temporarily unavailable.' }, { status: 503 })
    const event = await client.withConfig({ useCdn: false }).fetch<{ status?: string; registrationClosed?: boolean } | null>(EVENT_BY_ID_QUERY, { id: eventId })
    if (!event || event.status === 'past' || event.registrationClosed) {
      return NextResponse.json({ error: 'Registration for this event is closed.' }, { status: 409 })
    }
    const normalizedMemberId = memberId.toUpperCase()
    const ip = getClientIp(request)
    if (!(await rateLimit(`event-member-code-ip:${ip}`, 5, 10 * 60_000)) ||
        !(await rateLimit(`event-member-code-id:${normalizedMemberId}`, 3, 10 * 60_000))) {
      return NextResponse.json({ error: 'Too many code requests. Please wait a few minutes and try again.' }, { status: 429 })
    }

    const [member] = await db`
      SELECT member_id, first_name, email FROM members
      WHERE UPPER(member_id) = ${normalizedMemberId} AND status = 'active'
      LIMIT 1
    `

    // Keep invalid IDs indistinguishable from valid ones to prevent member enumeration.
    if (member) {
      const challenge = createMemberVerificationCode()
      await createEventMemberChallenge({
        challengeId: challenge.challengeId,
        eventId,
        memberId: String(member.member_id),
        codeHash: challenge.codeHash,
      })
      try {
        await sendEventMemberVerificationCode({ to: String(member.email), firstName: String(member.first_name), code: challenge.code })
      } catch (error) {
        console.error('Failed to send event member verification code:', error)
        await db`DELETE FROM event_member_verifications WHERE challenge_id = ${challenge.challengeId}::uuid`
        return NextResponse.json({ error: 'We could not send a verification email right now. Please try again later.' }, { status: 503 })
      }
      return NextResponse.json({ success: true, challengeId: challenge.challengeId }, { headers: { 'Cache-Control': 'no-store' } })
    }

    return NextResponse.json({ success: true, challengeId: randomUUID() }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    const bodyError = requestBodyErrorResponse(error)
    if (bodyError) return NextResponse.json({ error: bodyError.message }, { status: bodyError.status })
    console.error('[/api/register/member-code] Error:', error)
    return NextResponse.json({ error: 'Could not request a verification code. Please try again.' }, { status: 500 })
  }
}
