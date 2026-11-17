import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { after, NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { recordEventMemberOtpAttempt, verifyMemberVerificationCode } from '@/lib/event-member-verification'
import { getClientIp, rateLimitStatus } from '@/lib/ratelimit'
import { accountVerificationAttempts, accountVerificationWindow, challengeAttempts, minute, networkLimit } from '@/lib/registration-limits'
import { readJsonRequest, requestBodyErrorResponse } from '@/lib/request-body'

export const runtime = 'nodejs'
const schema = z.object({ eventId: z.string().min(1).max(128), challengeId: z.uuid(), previousChallengeId: z.uuid().optional(), code: z.string().regex(/^\d{6}$/) })

export async function POST(request: NextRequest) {
  let eventId: string | null = null
  try {
    const network = await rateLimitStatus(`event-otp-verify:ip:${getClientIp(request)}`, networkLimit('EVENT_OTP_VERIFY_IP_LIMIT', 600), 10 * minute)
    if (!network.allowed) {
      after(() => recordEventMemberOtpAttempt(null, 'rate_limited'))
      return NextResponse.json({ error: 'Too many attempts from this network. Please wait and try again.', retryAfter: network.retryAfter },
        { status: 429, headers: { 'Retry-After': String(network.retryAfter) } })
    }
    const body = schema.safeParse(await readJsonRequest(request, 2048))
    if (!body.success) return NextResponse.json({ error: 'Enter the six-digit code from your email.' }, { status: 400 })
    const { challengeId, previousChallengeId, code } = body.data
    eventId = body.data.eventId
    const proofId = randomUUID()
    const result = await db.begin(async (tx) => {
      const [challenge] = await tx`
        SELECT challenge_id, code_hash, member_id FROM event_member_verifications
        WHERE challenge_id IN (${challengeId}::uuid, ${previousChallengeId ?? null}::uuid) AND event_id = ${eventId}
          AND NOT pending_delivery AND verified_at IS NULL AND consumed_at IS NULL AND expires_at > NOW()
          AND attempts < ${challengeAttempts}
        ORDER BY (challenge_id = ${challengeId}::uuid) DESC LIMIT 1
        FOR UPDATE
      `
      if (!challenge) return null
      const account = await rateLimitStatus(`event-otp-verify:account:${String(challenge.member_id)}`, accountVerificationAttempts, accountVerificationWindow, tx)
      if (!account.allowed) return null
      if (!verifyMemberVerificationCode(String(challenge.challenge_id), code, String(challenge.code_hash))) {
        await tx`UPDATE event_member_verifications SET attempts = attempts + 1 WHERE challenge_id = ${challenge.challenge_id}::uuid`
        return null
      }
      const [member] = await tx`
        SELECT first_name, last_name, university, study_level, occupation, organization, kamp_position, membership_type
        FROM members WHERE member_id = ${String(challenge.member_id)} AND status = 'active' LIMIT 1
      `
      if (!member) return null
      // Exchange the public challenge for a fresh, single-use registration proof.
      await tx`UPDATE event_member_verifications SET challenge_id = ${proofId}::uuid, verified_at = NOW()
        WHERE challenge_id = ${challenge.challenge_id}::uuid`
      return member
    })
    after(() => recordEventMemberOtpAttempt(result ? eventId : null, result ? 'code_verified' : 'code_invalid'))
    if (!result) return NextResponse.json(
      { error: 'That code could not be verified. It may be incorrect, expired, replaced, or out of attempts. Use the latest code or request another.' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } },
    )
    return NextResponse.json({
      success: true,
      challengeId: proofId,
      member: {
        fullName: `${result.first_name} ${result.last_name}`,
        affiliation: result.university || result.occupation || result.organization || 'KAMP member',
        level: result.study_level || result.kamp_position || String(result.membership_type).replace('_', ' '),
      },
    }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    const bodyError = requestBodyErrorResponse(error)
    if (bodyError) return NextResponse.json({ error: bodyError.message }, { status: bodyError.status })
    after(() => recordEventMemberOtpAttempt(null, 'system_error'))
    return NextResponse.json({ error: 'Could not verify your code. Please try again.' }, { status: 500 })
  }
}
