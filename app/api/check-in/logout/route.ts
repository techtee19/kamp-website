import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { CHECKIN_SESSION_COOKIE, checkinSessionCookieOptions, hashCheckinSession } from '@/lib/checkin-access'
import { isSameOriginAdminRequest } from '@/lib/admin-request'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  if (!isSameOriginAdminRequest(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  const cookieStore = await cookies()
  const token = cookieStore.get(CHECKIN_SESSION_COOKIE)?.value
  if (token) await db`DELETE FROM event_checkin_sessions WHERE token_hash = ${hashCheckinSession(token)}`
  const response = NextResponse.json({ success: true })
  response.cookies.set(CHECKIN_SESSION_COOKIE, '', { ...checkinSessionCookieOptions(), maxAge: 0 })
  return response
}
