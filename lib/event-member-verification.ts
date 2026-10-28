import { createHmac, randomInt, randomUUID, timingSafeEqual } from 'node:crypto'
import { db } from '@/lib/db'

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
