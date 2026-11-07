import 'server-only'
import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'

const COOKIE = 'kamp_leader_session'
const MAX_AGE = 60 * 60 * 24 * 7

function getSecret(): string | null {
  const value = process.env.LEADER_SESSION_SECRET
  return value && value.length >= 32 ? value : null
}

function sign(payload: string): string | null {
  const secret = getSecret()
  return secret ? createHmac('sha256', secret).update(payload).digest('hex') : null
}

function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a)
  const y = Buffer.from(b)
  return x.length === y.length && timingSafeEqual(x, y)
}

export const generateToken = () => randomBytes(32).toString('hex')
export const hashToken = (token: string) => createHash('sha256').update(token).digest('hex')

export async function createLeaderSession(leaderId: number) {
  const secret = getSecret()
  if (!secret) throw new Error('LEADER_SESSION_SECRET must contain at least 32 characters')
  const expires = Date.now() + MAX_AGE * 1000
  const payload = `${leaderId}.${expires}`
  const signature = createHmac('sha256', secret).update(payload).digest('hex')
  const store = await cookies()
  store.set(COOKIE, `${payload}.${signature}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE,
    path: '/leaders',
  })
}

export async function destroyLeaderSession() {
  const store = await cookies()
  store.delete({ name: COOKIE, path: '/leaders' })
}

export async function getLeader() {
  const secret = getSecret()
  if (!secret) return null
  const store = await cookies()
  const raw = store.get(COOKIE)?.value
  if (!raw) return null
  const parts = raw.split('.')
  if (parts.length !== 3) return null
  const [idText, expiresText, signature] = parts
  if (!/^\d+$/.test(idText) || !/^\d+$/.test(expiresText) || !/^[a-f0-9]{64}$/.test(signature)) return null
  const id = Number(idText)
  const expires = Number(expiresText)
  if (!Number.isSafeInteger(id) || id < 1 || !Number.isSafeInteger(expires) || expires <= Date.now()) return null
  const expected = sign(`${idText}.${expiresText}`)
  if (!expected || !safeEqual(signature, expected)) return null

  const [leader] = await db`
    SELECT id, full_name, email, role, campus
    FROM public.leaders
    WHERE id = ${id} AND status = 'active'
    LIMIT 1
  `
  return leader ?? null
}

export async function requireLeader() {
  const leader = await getLeader()
  if (!leader) redirect('/leaders/login')
  return leader
}
