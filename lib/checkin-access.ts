import { createHash, randomBytes } from 'node:crypto'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-session'

export const CHECKIN_SESSION_COOKIE = 'kamp_checkin_session'
export const CHECKIN_SESSION_SECONDS = 60 * 60 * 12

export type EventCheckinActor = {
  role: 'admin' | 'operator'
  operatorId: number | null
  email: string
}

export function hashCheckinSession(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

export async function createCheckinSession(operatorId: number) {
  const token = randomBytes(32).toString('base64url')
  const tokenHash = hashCheckinSession(token)
  await db`
    INSERT INTO event_checkin_sessions (token_hash, operator_id, expires_at)
    VALUES (${tokenHash}, ${operatorId}, NOW() + (${CHECKIN_SESSION_SECONDS} * INTERVAL '1 second'))
  `
  return token
}

export async function getCheckinOperatorSession(eventSlug: string) {
  const token = (await cookies()).get(CHECKIN_SESSION_COOKIE)?.value
  if (!token || !/^[A-Za-z0-9_-]{40,50}$/.test(token)) return null
  const [session] = await db`
    SELECT operator.id, operator.email
    FROM event_checkin_sessions AS session
    JOIN event_checkin_operators AS operator ON operator.id = session.operator_id
    WHERE session.token_hash = ${hashCheckinSession(token)}
      AND session.expires_at > NOW()
      AND operator.enabled = TRUE
      AND operator.event_slug = ${eventSlug}
    LIMIT 1
  `
  return session ? { id: Number(session.id), email: String(session.email) } : null
}

export async function authorizeEventCheckin(eventSlug: string): Promise<EventCheckinActor | null> {
  if (await getAdminSession()) return { role: 'admin', operatorId: null, email: 'Admin' }
  const operator = await getCheckinOperatorSession(eventSlug)
  return operator ? { role: 'operator', operatorId: operator.id, email: operator.email } : null
}

export function checkinSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: CHECKIN_SESSION_SECONDS,
    path: '/',
  }
}
