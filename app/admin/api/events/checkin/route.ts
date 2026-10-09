import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-session'
import { isSameOriginAdminRequest } from '@/lib/admin-request'
import { quoteEventTableName } from '@/lib/admin-data'
import { readJsonRequest, requestBodyErrorResponse } from '@/lib/request-body'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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

  try {
    const [event] = await db`SELECT table_name FROM event_tables_registry WHERE event_slug = ${eventSlug} LIMIT 1`
    if (!event) return NextResponse.json({ error: 'Event not found.' }, { status: 404 })
    const table = quoteEventTableName(event.table_name)
    const changed = await db.unsafe(
      `UPDATE ${table} SET checked_in = $1, checked_in_at = CASE WHEN $1 THEN NOW() ELSE NULL END WHERE id = $2 AND status = 'confirmed' RETURNING id, checked_in`,
      [checkedIn as boolean, registrationId as number]
    )
    if (!changed.length) return NextResponse.json({ error: 'Confirmed registration not found.' }, { status: 404 })
    return NextResponse.json({ success: true, checkedIn: changed[0].checked_in }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Admin event check-in update failed:', error)
    return NextResponse.json({ error: 'Could not update check-in. Confirm the database migration has been applied.' }, { status: 500 })
  }
}
