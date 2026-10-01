import { timingSafeEqual } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { createAdminSession } from '@/lib/admin-session'
import { getClientIp, rateLimit } from '@/lib/ratelimit'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  if (!rateLimit(`admin-login:${getClientIp(req)}`, 5, 60_000)) {
    return NextResponse.json({ error: 'Too many attempts. Try again in a minute.' }, { status: 429 })
  }

  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET.length < 32) {
    return NextResponse.json({ error: 'Admin login is not configured.' }, { status: 503 })
  }
  if (!req.headers.get('content-type')?.includes('application/json')) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 415 })
  }

  try {
    if (Number(req.headers.get('content-length') ?? 0) > 4096) {
      return NextResponse.json({ error: 'Request is too large.' }, { status: 413 })
    }
    const raw = await req.text()
    if (Buffer.byteLength(raw, 'utf8') > 4096) return NextResponse.json({ error: 'Request is too large.' }, { status: 413 })
    const body: unknown = JSON.parse(raw)
    const password = typeof body === 'object' && body !== null && 'password' in body && typeof body.password === 'string'
      ? body.password
      : ''
    const expected = Buffer.from(process.env.ADMIN_PASSWORD)
    const received = Buffer.from(password)
    const matches = expected.length === received.length && timingSafeEqual(expected, received)
    if (!matches) return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 })

    await createAdminSession()
    return NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return NextResponse.json({ error: 'Invalid login request.' }, { status: 400 })
  }
}
