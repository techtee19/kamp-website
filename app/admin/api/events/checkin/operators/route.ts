import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-session'
import { isSameOriginAdminRequest } from '@/lib/admin-request'
import { getSiteOrigin } from '@/lib/community'
import { sendEventCheckinAccessInvitation } from '@/lib/email'
import { readJsonRequest, requestBodyErrorResponse } from '@/lib/request-body'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const eventSlugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
const createSchema = z.object({ eventSlug: eventSlugSchema, email: z.string().trim().max(254).pipe(z.email()) })
const revokeSchema = z.object({ eventSlug: eventSlugSchema, operatorId: z.number().int().positive() })

export async function GET(request: NextRequest) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const eventSlug = request.nextUrl.searchParams.get('eventSlug')
  if (!eventSlugSchema.safeParse(eventSlug).success) return NextResponse.json({ error: 'Invalid event.' }, { status: 400 })
  try {
    const operators = await db`
      SELECT id, email, enabled, created_at
      FROM event_checkin_operators WHERE event_slug = ${eventSlug}
      ORDER BY enabled DESC, created_at DESC
    `
    return NextResponse.json({ operators }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Could not load event check-in operators:', error)
    return NextResponse.json({ error: 'Could not load the check-in team. Confirm migration 017 has been applied.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!isSameOriginAdminRequest(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  let body: unknown
  try { body = await readJsonRequest(request, 2 * 1024) } catch (error) {
    const issue = requestBodyErrorResponse(error)
    return NextResponse.json({ error: issue?.message ?? 'Invalid request body.' }, { status: issue?.status ?? 400 })
  }
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Enter a valid email address and event.' }, { status: 400 })

  const email = parsed.data.email.toLowerCase()
  try {
    const [event] = await db`
      SELECT event_title FROM event_tables_registry WHERE event_slug = ${parsed.data.eventSlug} LIMIT 1
    `
    if (!event) return NextResponse.json({ error: 'Event not found.' }, { status: 404 })
    const [operator] = await db`
      INSERT INTO event_checkin_operators (event_slug, email, enabled)
      VALUES (${parsed.data.eventSlug}, ${email}, TRUE)
      ON CONFLICT (event_slug, email) DO UPDATE SET enabled = TRUE
      RETURNING id
    `
    await db`DELETE FROM event_checkin_login_codes WHERE operator_id = ${operator.id} AND consumed_at IS NULL`
    const loginUrl = new URL('/check-in/login', getSiteOrigin(request.nextUrl.origin))
    loginUrl.searchParams.set('event', parsed.data.eventSlug)
    try {
      await sendEventCheckinAccessInvitation({ to: email, eventTitle: String(event.event_title), loginUrl: loginUrl.toString() })
    } catch (error) {
      console.error('Could not email check-in access invitation:', error)
      return NextResponse.json({ error: 'Access was saved, but the invitation email failed. Check Resend and send the invite again.' }, { status: 502 })
    }
    return NextResponse.json({ success: true, email }, { status: 201 })
  } catch (error) {
    console.error('Could not create event check-in operator:', error)
    return NextResponse.json({ error: 'Could not add the check-in operator. Confirm migration 017 has been applied.' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!isSameOriginAdminRequest(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  let body: unknown
  try { body = await readJsonRequest(request, 2 * 1024) } catch (error) {
    const issue = requestBodyErrorResponse(error)
    return NextResponse.json({ error: issue?.message ?? 'Invalid request body.' }, { status: issue?.status ?? 400 })
  }
  const parsed = revokeSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid operator.' }, { status: 400 })
  try {
    const [revoked] = await db.begin(async (tx) => {
      const [operator] = await tx`
        UPDATE event_checkin_operators SET enabled = FALSE
        WHERE id = ${parsed.data.operatorId} AND event_slug = ${parsed.data.eventSlug}
        RETURNING id
      `
      if (operator) await tx`UPDATE event_checkin_sessions SET expires_at = NOW() WHERE operator_id = ${operator.id}`
      return operator ? [operator] : []
    })
    if (!revoked) return NextResponse.json({ error: 'Check-in operator not found.' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Could not revoke event check-in operator:', error)
    return NextResponse.json({ error: 'Could not revoke access. Confirm migration 017 has been applied.' }, { status: 500 })
  }
}
