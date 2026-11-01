import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { authorizeEventCheckin } from '@/lib/checkin-access'
import { isSameOriginAdminRequest } from '@/lib/admin-request'
import { quoteEventTableName } from '@/lib/admin-data'
import { readJsonRequest, requestBodyErrorResponse } from '@/lib/request-body'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  if (!isSameOriginAdminRequest(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })

  let body: unknown
  try {
    body = await readJsonRequest(request, 1024)
  } catch (error) {
    const issue = requestBodyErrorResponse(error)
    return NextResponse.json({ error: issue?.message ?? 'Invalid request body.' }, { status: issue?.status ?? 400 })
  }
  if (typeof body !== 'object' || body === null) return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  const { eventSlug, ticketRef } = body as Record<string, unknown>
  if (
    typeof eventSlug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(eventSlug) ||
    typeof ticketRef !== 'string' || !/^KAMP-\d{2}-[A-F0-9]{20}$/.test(ticketRef)
  ) {
    return NextResponse.json({ error: 'This QR code is not a valid KAMP event ticket.' }, { status: 400 })
  }
  const actor = await authorizeEventCheckin(eventSlug)
  if (!actor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const [event] = await db`SELECT table_name FROM event_tables_registry WHERE event_slug = ${eventSlug} LIMIT 1`
    if (!event) return NextResponse.json({ error: 'Event not found.' }, { status: 404 })
    const table = quoteEventTableName(event.table_name)
    const checkedIn = await db.begin(async (tx) => {
      const changed = await tx.unsafe(
        `UPDATE ${table}
         SET checked_in = TRUE, checked_in_at = NOW()
         WHERE ticket_ref = $1 AND status = 'confirmed' AND checked_in = FALSE
         RETURNING id, full_name, ticket_ref, checked_in_at`,
        [ticketRef],
      )
      if (changed.length) {
        await tx`
          INSERT INTO event_checkin_audit (event_slug, registration_id, ticket_ref, operator_id, actor_email, action)
          VALUES (${eventSlug}, ${Number(changed[0].id)}, ${ticketRef}, ${actor.operatorId}, ${actor.email}, 'checked_in')
        `
      }
      return changed
    })

    if (checkedIn.length) {
      return NextResponse.json({ success: true, alreadyCheckedIn: false, attendee: checkedIn[0] }, { headers: { 'Cache-Control': 'no-store' } })
    }

    const [existing] = await db.unsafe(
      `SELECT id, full_name, ticket_ref, status, checked_in, checked_in_at
       FROM ${table} WHERE ticket_ref = $1 LIMIT 1`,
      [ticketRef],
    )
    if (!existing) return NextResponse.json({ error: 'This ticket is not registered for this event.' }, { status: 404 })
    if (existing.status !== 'confirmed') return NextResponse.json({ error: 'This registration is not confirmed and cannot be checked in.' }, { status: 409 })
    return NextResponse.json({ success: true, alreadyCheckedIn: true, attendee: existing }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Admin event ticket scan failed:', error)
    return NextResponse.json({ error: 'Could not check in this ticket. Confirm the event check-in migration has been applied.' }, { status: 500 })
  }
}
