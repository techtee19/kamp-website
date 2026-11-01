import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyCheckinLoginCode } from '@/lib/checkin-code'
import { createCheckinSession, CHECKIN_SESSION_COOKIE, checkinSessionCookieOptions } from '@/lib/checkin-access'
import { isSameOriginAdminRequest } from '@/lib/admin-request'
import { getClientIp, rateLimit } from '@/lib/ratelimit'
import { readJsonRequest, requestBodyErrorResponse } from '@/lib/request-body'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const requestSchema = z.object({
  eventSlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  email: z.string().trim().max(254).pipe(z.email()),
  code: z.string().regex(/^\d{6}$/),
})

export async function POST(request: NextRequest) {
  if (!isSameOriginAdminRequest(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  try {
    if (!(await rateLimit(`checkin-verify-ip:${getClientIp(request)}`, 10, 10 * 60_000))) {
      return NextResponse.json({ error: 'Too many attempts. Wait a few minutes and try again.' }, { status: 429 })
    }
    const parsed = requestSchema.safeParse(await readJsonRequest(request, 2 * 1024))
    if (!parsed.success) return NextResponse.json({ error: 'Enter the six-digit code sent to your email.' }, { status: 400 })

    const eventSlug = parsed.data.eventSlug
    const email = parsed.data.email.toLowerCase()
    const operator = await db.begin(async (tx) => {
      const [challenge] = await tx`
        SELECT code.challenge_id, code.code_hash, code.attempts, operator.id
        FROM event_checkin_login_codes AS code
        JOIN event_checkin_operators AS operator ON operator.id = code.operator_id
        WHERE operator.event_slug = ${eventSlug} AND operator.email = ${email} AND operator.enabled = TRUE
          AND code.consumed_at IS NULL AND code.expires_at > NOW() AND code.attempts < 5
        ORDER BY code.created_at DESC
        LIMIT 1 FOR UPDATE OF code
      `
      if (!challenge) return null
      const valid = verifyCheckinLoginCode(String(challenge.challenge_id), parsed.data.code, String(challenge.code_hash).trim())
      if (!valid) {
        await tx`UPDATE event_checkin_login_codes SET attempts = attempts + 1 WHERE challenge_id = ${challenge.challenge_id}::uuid`
        return null
      }
      await tx`UPDATE event_checkin_login_codes SET consumed_at = NOW() WHERE challenge_id = ${challenge.challenge_id}::uuid`
      return { id: Number(challenge.id) }
    })

    if (!operator) return NextResponse.json({ error: 'That code is invalid or expired. Request a new code and try again.' }, { status: 400 })
    const sessionToken = await createCheckinSession(operator.id)
    const response = NextResponse.json({ success: true, redirectTo: `/check-in/${encodeURIComponent(eventSlug)}` }, { headers: { 'Cache-Control': 'no-store' } })
    response.cookies.set(CHECKIN_SESSION_COOKIE, sessionToken, checkinSessionCookieOptions())
    return response
  } catch (error) {
    const issue = requestBodyErrorResponse(error)
    if (issue) return NextResponse.json({ error: issue.message }, { status: issue.status })
    console.error('Event check-in code verification failed:', error)
    return NextResponse.json({ error: 'Could not verify that code. Please try again.' }, { status: 500 })
  }
}
