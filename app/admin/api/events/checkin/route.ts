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
  try { body = await readJsonRequest(request, 1024) } catch (error) {
    const issue = requestBodyErrorResponse(error)
    return NextResponse.json({ error: issue?.message ?? 'Invalid request body.' }, { status: issue?.status ?? 400 })
  }
  if (typeof body !== 'object' || body === null) return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  const { registrationId, eventSlug, checkedIn } = body as Record<string, unknown>
  if (!Number.isSafeInteger(registrationId) || (registrationId as number) < 1 || typeof eventSlug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(eventSlug) || typeof checkedIn !== 'boolean') {
    return NextResponse.json({ error: 'Invalid check-in request.' }, { status: 400 })
  }
  const actor = await authorizeEventCheckin(eventSlug)
  if (!actor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (actor.role === 'operator' && checkedIn !== true) return NextResponse.json({ error: 'Check-in operators cannot undo a check-in.' }, { status: 403 })

  try {
    const [event] = await db`SELECT table_name FROM event_tables_registry WHERE event_slug = ${eventSlug} LIMIT 1`
    if (!event) return NextResponse.json({ error: 'Event not found.' }, { status: 404 })
    const table = quoteEventTableName(event.table_name)
    const outcome = await db.begin(async (tx) => {
      const changed = await tx.unsafe(
        `UPDATE ${table} SET checked_in = $1, checked_in_at = CASE WHEN $1 THEN NOW() ELSE NULL END WHERE id = $2 AND status = 'confirmed' AND checked_in IS DISTINCT FROM $1 RETURNING id, ticket_ref, checked_in`,
        [checkedIn as boolean, registrationId as number]
      )
      if (changed.length) {
        await tx`
          INSERT INTO event_checkin_audit (event_slug, registration_id, ticket_ref, operator_id, actor_email, action)
          VALUES (${eventSlug}, ${registrationId as number}, ${String(changed[0].ticket_ref)}, ${actor.operatorId}, ${actor.email}, ${checkedIn ? 'checked_in' : 'reverted'})
        `
        return { checkedIn: Boolean(changed[0].checked_in) }
      }
      const [existing] = await tx.unsafe(`SELECT checked_in FROM ${table} WHERE id = $1 AND status = 'confirmed' LIMIT 1`, [registrationId as number])
      return existing ? { checkedIn: Boolean(existing.checked_in) } : null
    })
    if (!outcome) return NextResponse.json({ error: 'Confirmed registration not found.' }, { status: 404 })
    return NextResponse.json({ success: true, checkedIn: outcome.checkedIn }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Admin event check-in update failed:', error)
    return NextResponse.json({ error: 'Could not update check-in. Confirm the database migration has been applied.' }, { status: 500 })
  }
}
