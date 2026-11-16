import { createHmac, randomInt, randomUUID, timingSafeEqual } from 'node:crypto'
import { db } from '@/lib/db'

export type EventMemberOtpOutcome =
  | 'invalid_request'
  | 'event_unavailable'
  | 'service_unavailable'
  | 'rate_limited'
  | 'member_not_found'
  | 'email_accepted'
  | 'email_rejected'
  | 'code_verified'
  | 'code_invalid'
  | 'system_error'

/**
 * Store operational outcomes without retaining member IDs, email addresses,
 * OTP values, or IP addresses. Audit failures must never block registration.
 */
export async function recordEventMemberOtpAttempt(params: {
  eventId?: string | null
  outcome: EventMemberOtpOutcome
  providerMessageId?: string | null
}) {
  try {
    const [row] = await db`
      INSERT INTO event_member_otp_audit (event_id, outcome, provider_message_id)
      VALUES (${params.eventId ?? null}, ${params.outcome}, ${params.providerMessageId ?? null})
      RETURNING id
    `

    // Keep the diagnostic history bounded without a scheduled database job.
    if (Number(row?.id) % 100 === 0) {
      await db`DELETE FROM event_member_otp_audit WHERE created_at < NOW() - INTERVAL '180 days'`
    }
  } catch (error) {
    console.error('[event-member-otp-audit] Could not record attempt:', error instanceof Error ? error.message : 'Unknown database error')
  }
}

function codeHash(challengeId: string, code: string): string {
  const secret = process.env.DATABASE_URL
  if (!secret) throw new Error('DATABASE_URL is required for member verification')
  return createHmac('sha256', secret).update(`${challengeId}:${code}`).digest('hex')
}

export function createMemberVerificationCode() {
  const challengeId = randomUUID()
  const code = String(randomInt(0, 1_000_000)).padStart(6, '0')
  return { challengeId, code, codeHash: codeHash(challengeId, code) }
}

export function verifyMemberVerificationCode(challengeId: string, code: string, expectedHash: string) {
  const actual = Buffer.from(codeHash(challengeId, code), 'hex')
  const expected = Buffer.from(expectedHash, 'hex')
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

export async function createEventMemberChallenge(params: {
  challengeId: string
  eventId: string
  memberId: string
  codeHash: string
}) {
  await db.begin(async (tx) => {
    await tx`
      DELETE FROM event_member_verifications
      WHERE expires_at <= NOW() OR consumed_at IS NOT NULL
    `
    await tx`
      UPDATE event_member_verifications SET consumed_at = NOW()
      WHERE event_id = ${params.eventId} AND member_id = ${params.memberId}
        AND consumed_at IS NULL
    `
    await tx`
      INSERT INTO event_member_verifications (challenge_id, event_id, member_id, code_hash, expires_at)
      VALUES (${params.challengeId}::uuid, ${params.eventId}, ${params.memberId}, ${params.codeHash}, NOW() + INTERVAL '10 minutes')
    `
  })
}
