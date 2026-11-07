import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createLeaderSession, hashToken } from '@/lib/leader-auth'
import { isSameOriginLeaderRequest } from '@/lib/leader-request'
import { readJsonRequest } from '@/lib/request-body'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  if (!isSameOriginLeaderRequest(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  let token: unknown
  try { token = (await readJsonRequest(request, 1024) as { token?: unknown }).token } catch { token = null }
  if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) return NextResponse.json({ error: 'This sign-in link is invalid or expired.' }, { status: 400 })
  try {
    const leaderId = await db.begin(async (tx) => {
      const [record] = await tx`
        SELECT token.id, token.leader_id
        FROM leader_login_tokens AS token
        JOIN leaders ON leaders.id = token.leader_id
        WHERE token.token_hash = ${hashToken(token)} AND token.used_at IS NULL
          AND token.expires_at > NOW() AND leaders.status = 'active'
        FOR UPDATE OF token
      `
      if (!record) return null
      await tx`UPDATE leader_login_tokens SET used_at = NOW() WHERE id = ${record.id}`
      await tx`UPDATE leaders SET last_login_at = NOW() WHERE id = ${record.leader_id}`
      return Number(record.leader_id)
    })
    if (!leaderId) return NextResponse.json({ error: 'This sign-in link has expired or has already been used. Request a new one.' }, { status: 400 })
    await createLeaderSession(leaderId)
    return NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('[leaders/verify] Failed to verify sign-in token:', error)
    return NextResponse.json({ error: 'We could not verify this link right now. Please request a new one.' }, { status: 503 })
  }
}
