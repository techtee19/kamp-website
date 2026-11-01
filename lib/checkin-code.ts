import { createHmac, randomInt, randomUUID, timingSafeEqual } from 'node:crypto'

function codeHash(challengeId: string, code: string) {
  const secret = process.env.DATABASE_URL
  if (!secret) throw new Error('DATABASE_URL is required for check-in code verification')
  return createHmac('sha256', secret).update(`${challengeId}:${code}`).digest('hex')
}

export function createCheckinLoginCode() {
  const challengeId = randomUUID()
  const code = String(randomInt(0, 1_000_000)).padStart(6, '0')
  return { challengeId, code, codeHash: codeHash(challengeId, code) }
}

export function verifyCheckinLoginCode(challengeId: string, code: string, expectedHash: string) {
  const actual = Buffer.from(codeHash(challengeId, code), 'hex')
  const expected = Buffer.from(expectedHash, 'hex')
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}
