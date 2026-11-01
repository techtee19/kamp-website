import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendEventCheckinLoginCode } from '@/lib/email'
import { isSameOriginAdminRequest } from '@/lib/admin-request'
import { createCheckinLoginCode } from '@/lib/checkin-code'
import { getClientIp, rateLimit } from '@/lib/ratelimit'
import { readJsonRequest, requestBodyErrorResponse } from '@/lib/request-body'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const requestSchema = z.object({ eventSlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), email: z.string().trim().max(254).pipe(z.email()) })

export async function POST(request: NextRequest) {
  if (!isSameOriginAdminRequest(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  try {
    const parsed = requestSchema.safeParse(await readJsonRequest(request, 2 * 1024))
    if (!parsed.success) return NextResponse.json({ error: 'Enter the email address assigned to this event.' }, { status: 400 })
    const eventSlug = parsed.data.eventSlug
    const email = parsed.data.email.toLowerCase()
    const ip = getClientIp(request)
    if (!(await rateLimit(`checkin-code-ip:${ip}`, 8, 15 * 60_000)) ||
        !(await rateLimit(`checkin-code:${eventSlug}:${email}`, 4, 15 * 60_000))) {
      return NextResponse.json({ error: 'Too many code requests. Wait a few minutes and try again.' }, { status: 429 })
    }

    const [operator] = await db`
      SELECT operator.id, event.event_title
      FROM event_checkin_operators AS operator
      JOIN event_tables_registry AS event ON event.event_slug = operator.event_slug
      WHERE operator.event_slug = ${eventSlug} AND operator.email = ${email} AND operator.enabled = TRUE
      LIMIT 1
    `
    if (operator) {
      const challenge = createCheckinLoginCode()
      await db.begin(async (tx) => {
        await tx`UPDATE event_checkin_login_codes SET consumed_at = NOW() WHERE operator_id = ${operator.id} AND consumed_at IS NULL`
        await tx`
          INSERT INTO event_checkin_login_codes (challenge_id, operator_id, code_hash, expires_at)
          VALUES (${challenge.challengeId}::uuid, ${operator.id}, ${challenge.codeHash}, NOW() + INTERVAL '10 minutes')
        `
      })
      try {
        await sendEventCheckinLoginCode({ to: email, eventTitle: String(operator.event_title), code: challenge.code })
      } catch (error) {
        console.error('Could not send event check-in sign-in code:', error)
      }
    }

    // Use the same response whether or not the address is assigned to this event.
    return NextResponse.json({ success: true, message: 'If this email has event check-in access, a code will arrive shortly.' }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    const issue = requestBodyErrorResponse(error)
    if (issue) return NextResponse.json({ error: issue.message }, { status: issue.status })
    console.error('Event check-in code request failed:', error)
    return NextResponse.json({ error: 'Could not request a sign-in code. Please try again.' }, { status: 500 })
  }
}
