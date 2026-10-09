import { scryptSync, timingSafeEqual } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { createAdminSession } from '@/lib/admin-session'
import { getClientIp, rateLimit } from '@/lib/ratelimit'
import { readJsonRequest, requestBodyErrorResponse } from '@/lib/request-body'

export const runtime = 'nodejs'

function verifyPassword(password: string, encodedHash: string): boolean {
  const [algorithm, salt, expectedHex, extra] = encodedHash.split('$')
  if (algorithm !== 'scrypt' || !salt || !expectedHex || extra !== undefined) return false
  if (!/^[a-f0-9]{32}$/.test(salt) || !/^[a-f0-9]{128}$/.test(expectedHex)) return false

  const expected = Buffer.from(expectedHex, 'hex')
  const received = scryptSync(password, salt, 64)
  return expected.length === received.length && timingSafeEqual(expected, received)
}

export async function POST(req: NextRequest) {
  try {
    if (!(await rateLimit(`admin-login:${getClientIp(req)}`, 5, 60_000))) {
      return NextResponse.json({ error: 'Too many attempts. Try again in a minute.' }, { status: 429, headers: { 'Cache-Control': 'no-store' } })
    }

    if (
      !process.env.ADMIN_PASSWORD_HASH ||
      !/^scrypt\$[a-f0-9]{32}\$[a-f0-9]{128}$/.test(process.env.ADMIN_PASSWORD_HASH) ||
      !process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET.length < 32
    ) {
      return NextResponse.json({ error: 'Admin login is not configured.' }, { status: 503, headers: { 'Cache-Control': 'no-store' } })
    }

    const body = await readJsonRequest(req, 4096)
    const password = typeof body === 'object' && body !== null && 'password' in body && typeof body.password === 'string'
      ? body.password
      : ''
    if (!password || password.length > 256 || !verifyPassword(password, process.env.ADMIN_PASSWORD_HASH!)) {
      return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 })
    }

    await createAdminSession()
    return NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    const bodyError = requestBodyErrorResponse(error)
    if (bodyError) return NextResponse.json({ error: bodyError.message }, { status: bodyError.status, headers: { 'Cache-Control': 'no-store' } })
    console.error('[/admin/api/login] Login failed:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ error: 'Unable to complete login.' }, { status: 503, headers: { 'Cache-Control': 'no-store' } })
  }
}
