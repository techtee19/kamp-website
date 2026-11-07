import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getClientIp, rateLimit } from '@/lib/ratelimit'
import { generateToken, hashToken } from '@/lib/leader-auth'
import { leaderLoginRequestSchema } from '@/lib/leader-validations'
import { isSameOriginLeaderRequest } from '@/lib/leader-request'
import { sendLeaderLoginLink } from '@/lib/email'
import { readJsonRequest } from '@/lib/request-body'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  if (!isSameOriginLeaderRequest(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  if (!(await rateLimit(`leader-login:${getClientIp(request)}:${request.headers.get('user-agent') ?? ''}`, 5, 15 * 60_000))) {
    return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429 })
  }
  let body: unknown
  try { body = await readJsonRequest(request, 1024) } catch { return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 }) }
  const parsed = leaderLoginRequestSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 })
  const email = parsed.data.email.toLowerCase()
  try {
    const [leader] = await db`SELECT id, full_name, email FROM leaders WHERE email = ${email} AND status = 'active' LIMIT 1`
    if (leader) {
      const token = generateToken()
      await db`INSERT INTO leader_login_tokens (leader_id, token_hash, expires_at) VALUES (${leader.id}, ${hashToken(token)}, NOW() + INTERVAL '15 minutes')`
      // Build on the host the leader actually used. The absolute path ensures
      // the email never inherits an /admin path from a misconfigured base URL.
      const loginUrl = new URL('/leaders/verify', request.nextUrl.origin)
      loginUrl.searchParams.set('token', token)
      try { await sendLeaderLoginLink({ to: String(leader.email), fullName: String(leader.full_name), loginUrl: loginUrl.toString() }) }
      catch (emailError) { console.error('[leaders/request-link] Sign-in token issued, email delivery failed:', emailError) }
    }
    return NextResponse.json({ success: true, message: 'If this email has active portal access, a sign-in link is on its way.' }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('[leaders/request-link] Failed to issue sign-in link:', error)
    return NextResponse.json({ error: 'We could not send a sign-in link right now. Please try again shortly.' }, { status: 503 })
  }
}
