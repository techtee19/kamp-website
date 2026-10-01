import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { buildCsv, quoteEventTableName } from '@/lib/admin-data'
import { getAdminSession } from '@/lib/admin-session'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: { 'Cache-Control': 'no-store' } })

  const { slug } = await params
  const [event] = await db`SELECT event_title, event_slug, table_name FROM event_tables_registry WHERE event_slug = ${slug} LIMIT 1`
  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } })

  const table = quoteEventTableName(event.table_name)
  const registrations = await db.unsafe(`SELECT full_name, email, phone, university, study_level, status, ticket_ref, created_at FROM ${table} ORDER BY created_at ASC`)
  const csv = buildCsv(
    ['Full name', 'Email', 'Phone', 'Tertiary institution', 'Study level', 'Status', 'Ticket reference', 'Date registered'],
    registrations.map((registration) => [registration.full_name, registration.email, registration.phone, registration.university, registration.study_level, registration.status, registration.ticket_ref, new Date(registration.created_at as string).toLocaleDateString('en-NG')])
  )
  const safeSlug = String(event.event_slug).replace(/[^a-z0-9-]/gi, '-')

  return new NextResponse(csv, { headers: {
    'Content-Type': 'text/csv; charset=utf-8',
    'Content-Disposition': `attachment; filename="kamp-${safeSlug}-registrations.csv"`,
    'Cache-Control': 'private, no-store',
    'X-Content-Type-Options': 'nosniff',
  } })
}
