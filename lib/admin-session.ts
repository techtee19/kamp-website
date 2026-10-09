import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

const SESSION_COOKIE = 'kamp_admin_session'
const MAX_AGE_SECONDS = 60 * 60 * 2

function getSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET
  return secret && secret.length >= 32 ? secret : null
}

function signValue(value: string, secret = getSecret()): string | null {
  if (!secret) return null
  const signature = createHmac('sha256', secret).update(value).digest('hex')
  return `${value}.${signature}`
}

function verifyValue(signed: string): boolean {
  const secret = getSecret()
  const separator = signed.lastIndexOf('.')
  if (!secret || separator < 0) return false

  const value = signed.slice(0, separator)
  const signature = signed.slice(separator + 1)
  const expected = signValue(value, secret)?.split('.').at(-1)
  if (!expected || !/^[a-f0-9]{64}$/.test(signature)) return false

  const actualBuffer = Buffer.from(signature, 'hex')
  const expectedBuffer = Buffer.from(expected, 'hex')
  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) return false

  const match = /^admin_authenticated_(\d+)_(\d+)_([a-f0-9]{32})$/.exec(value)
  if (!match) return false
  const issuedAt = Number(match[1])
  const expiresAt = Number(match[2])
  const now = Date.now()
  return issuedAt <= now && expiresAt > now && expiresAt - issuedAt === MAX_AGE_SECONDS * 1000
}

export async function createAdminSession() {
  const secret = getSecret()
  if (!secret) throw new Error('ADMIN_SESSION_SECRET must contain at least 32 characters')
  const now = Date.now()
  const payload = `admin_authenticated_${now}_${now + MAX_AGE_SECONDS * 1000}_${randomBytes(16).toString('hex')}`
  const signed = signValue(payload, secret)
  if (!signed) throw new Error('Admin session signing is unavailable')

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, signed, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE_SECONDS,
    path: '/admin',
  })
}

export async function getAdminSession(): Promise<boolean> {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(SESSION_COOKIE)
  return cookie ? verifyValue(cookie.value) : false
}

export async function destroyAdminSession() {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/admin',
  })
}
