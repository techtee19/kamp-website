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

export async function recordEventMemberOtpAttempt(eventId: string | null, outcome: string, messageId: string | null = null, errorCode: string | null = null) {
  try {
    await db`INSERT INTO public.event_member_otp_audit (event_id, outcome, provider_message_id, provider_error_code)
      VALUES (${eventId}, ${outcome}, ${messageId}, ${errorCode})`
  } catch {
    console.error('[event-otp] Audit unavailable')
  }
}

export async function stageEventMemberChallenge(challengeId: string, eventId: string, memberId: string, hash: string) {
  await db.begin(async (tx) => {
    await tx`SELECT pg_advisory_xact_lock(hashtextextended(${JSON.stringify([eventId, memberId])}::text, 13))`
    await tx`
      INSERT INTO event_member_verifications (challenge_id, event_id, member_id, code_hash, expires_at, pending_delivery)
      VALUES (${challengeId}::uuid, ${eventId}, ${memberId}, ${hash}, NOW() + INTERVAL '10 minutes', TRUE)
    `
  })
}

export async function activateEventMemberChallenge(challengeId: string, eventId: string, memberId: string, recipient: string) {
  return db.begin(async (tx) => {
    await tx`SELECT pg_advisory_xact_lock(hashtextextended(${JSON.stringify([eventId, memberId])}::text, 13))`
    const [member] = await tx`SELECT 1 FROM members WHERE member_id = ${memberId} AND email = ${recipient} AND status = 'active'`
    if (!member) return false
    const [latest] = await tx`
      SELECT challenge_id FROM event_member_verifications
      WHERE event_id = ${eventId} AND member_id = ${memberId} AND consumed_at IS NULL
      ORDER BY created_at DESC, challenge_id DESC LIMIT 1 FOR UPDATE
    `
    if (latest?.challenge_id !== challengeId) return false
    await tx`
      UPDATE event_member_verifications SET consumed_at = NOW()
      WHERE event_id = ${eventId} AND member_id = ${memberId} AND consumed_at IS NULL
        AND verified_at IS NULL AND challenge_id <> ${challengeId}::uuid
    `
    await tx`
      UPDATE event_member_verifications SET pending_delivery = FALSE, expires_at = NOW() + INTERVAL '10 minutes'
      WHERE challenge_id = ${challengeId}::uuid
    `
    return true
  })
}
