import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { recordEventMemberOtpAttempt, verifyMemberVerificationCode } from '@/lib/event-member-verification'
import { getClientIp, rateLimit } from '@/lib/ratelimit'
import { readJsonRequest, requestBodyErrorResponse } from '@/lib/request-body'

export const runtime = 'nodejs'
const requestSchema = z.object({
  eventId: z.string().min(1).max(128),
  challengeId: z.uuid(),
  code: z.string().regex(/^\d{6}$/),
})

export async function POST(request: NextRequest) {
  let auditEventId: string | null = null
  try {
    if (!(await rateLimit(`event-member-verify:${getClientIp(request)}`, 10, 10 * 60_000))) {
      await recordEventMemberOtpAttempt({ outcome: 'rate_limited' })
      return NextResponse.json({ error: 'Too many attempts. Please wait a few minutes and try again.' }, { status: 429 })
    }
    const body = requestSchema.safeParse(await readJsonRequest(request, 2 * 1024))
    if (!body.success) {
      await recordEventMemberOtpAttempt({ outcome: 'invalid_request' })
      return NextResponse.json({ error: 'Enter the six-digit code from your email.' }, { status: 400 })
    }

    const { eventId, challengeId, code } = body.data
    auditEventId = eventId
    const result = await db.begin(async (tx) => {
      const [challenge] = await tx`
        SELECT code_hash, attempts, member_id FROM event_member_verifications
        WHERE challenge_id = ${challengeId}::uuid AND event_id = ${eventId}
          AND verified_at IS NULL AND consumed_at IS NULL AND expires_at > NOW()
          AND attempts < 5
        FOR UPDATE
      `
      if (!challenge) return null

      const valid = verifyMemberVerificationCode(challengeId, code, String(challenge.code_hash))
      if (!valid) {
        await tx`UPDATE event_member_verifications SET attempts = attempts + 1 WHERE challenge_id = ${challengeId}::uuid`
        return null
      }

      const [member] = await tx`
        SELECT member_id, first_name, last_name, email, phone, membership_type,
          university, study_level, occupation, organization, kamp_position
        FROM members WHERE member_id = ${String(challenge.member_id)} AND status = 'active'
        LIMIT 1
      `
      if (!member) return null
      await tx`UPDATE event_member_verifications SET verified_at = NOW() WHERE challenge_id = ${challengeId}::uuid`
      return member
    })

    if (!result) {
      await recordEventMemberOtpAttempt({ eventId, outcome: 'code_invalid' })
      return NextResponse.json({ error: 'That code is invalid or expired. Request a new code and try again.' }, { status: 400 })
    }
    await recordEventMemberOtpAttempt({ eventId, outcome: 'code_verified' })
    return NextResponse.json({
      success: true,
      challengeId,
      member: {
        fullName: `${result.first_name} ${result.last_name}`,
        email: result.email,
        phone: result.phone,
        affiliation: result.university || result.occupation || result.organization || 'KAMP member',
        level: result.study_level || result.kamp_position || String(result.membership_type).replace('_', ' '),
      },
    }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    const bodyError = requestBodyErrorResponse(error)
    if (bodyError) return NextResponse.json({ error: bodyError.message }, { status: bodyError.status })
    await recordEventMemberOtpAttempt({ eventId: auditEventId, outcome: 'system_error' })
    console.error('[/api/register/member-verify] Error:', error)
    return NextResponse.json({ error: 'Could not verify your code. Please try again.' }, { status: 500 })
  }
}
