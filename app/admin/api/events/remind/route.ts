import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-session'
import { isSameOriginAdminRequest } from '@/lib/admin-request'
import { quoteEventTableName } from '@/lib/admin-data'
import { readJsonRequest, requestBodyErrorResponse } from '@/lib/request-body'
import { sendEventReminder } from '@/lib/email'
import { freshClient } from '@/sanity/lib/client'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function lagosDate() {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Lagos', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date())
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? ''
  return `${part('year')}-${part('month')}-${part('day')}`
}

export async function POST(request: NextRequest) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!isSameOriginAdminRequest(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  let body: unknown
  try { body = await readJsonRequest(request, 1024) } catch (error) {
    const issue = requestBodyErrorResponse(error)
    return NextResponse.json({ error: issue?.message ?? 'Invalid request body.' }, { status: issue?.status ?? 400 })
  }
  const eventSlug = typeof body === 'object' && body !== null && 'eventSlug' in body ? body.eventSlug : null
  if (typeof eventSlug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(eventSlug)) return NextResponse.json({ error: 'Invalid event.' }, { status: 400 })
  if (!freshClient) return NextResponse.json({ error: 'Event details are unavailable because Sanity is not configured.' }, { status: 503 })
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) return NextResponse.json({ error: 'Email delivery is not configured.' }, { status: 503 })

  try {
    const [event] = await db`SELECT event_id, event_title, table_name FROM event_tables_registry WHERE event_slug = ${eventSlug} LIMIT 1`
    if (!event) return NextResponse.json({ error: 'Event not found.' }, { status: 404 })
    const sanityEvent = await freshClient.fetch<{ isPublished?: boolean; status?: string; date?: string; title?: string; location?: string; university?: string } | null>(
      '*[_type == "event" && slug.current == $slug][0]{isPublished, status, date, title, location, university}', { slug: eventSlug }
    )
    if (!sanityEvent?.isPublished) return NextResponse.json({ error: 'This event is not published in Sanity.' }, { status: 409 })
    if (sanityEvent.status === 'past') return NextResponse.json({ error: 'Reminders cannot be sent for a past event.' }, { status: 409 })
    if (!sanityEvent.date || !/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(sanityEvent.date)) return NextResponse.json({ error: 'This event does not have a valid date.' }, { status: 409 })
    const start = new Date(sanityEvent.date)
    if (!Number.isFinite(start.getTime())) return NextResponse.json({ error: 'This event does not have a valid date.' }, { status: 409 })
    const isPast = /^\d{4}-\d{2}-\d{2}$/.test(sanityEvent.date)
      ? sanityEvent.date < lagosDate()
      : start.getTime() <= Date.now()
    if (isPast) return NextResponse.json({ error: 'Reminders cannot be sent for an event that has already started.' }, { status: 409 })

    const table = quoteEventTableName(event.table_name)
    const registrants = await db.unsafe(`SELECT full_name, email, ticket_ref FROM ${table} WHERE status = 'confirmed' ORDER BY created_at ASC`)
    if (registrants.length === 0) return NextResponse.json({ error: 'There are no confirmed registrants for this event.' }, { status: 409 })

    const date = start.toLocaleDateString('en-NG', { timeZone: 'Africa/Lagos', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    const time = /^\d{4}-\d{2}-\d{2}$/.test(sanityEvent.date) ? '' : start.toLocaleTimeString('en-NG', { timeZone: 'Africa/Lagos', hour: '2-digit', minute: '2-digit' })
    const title = sanityEvent.title || String(event.event_title)
    let sent = 0
    let failed = 0
    for (let i = 0; i < registrants.length; i += 10) {
      const batch = registrants.slice(i, i + 10)
      const outcomes = await Promise.all(batch.map(async (registrant) => {
        const email = String(registrant.email ?? '').trim()
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false
        try {
          await sendEventReminder({
            to: email,
            recipientName: String(registrant.full_name ?? 'there'),
            eventTitle: title,
            eventDate: date,
            eventTime: time,
            eventLocation: sanityEvent.location || 'Venue to be confirmed',
            university: sanityEvent.university || '',
            ticketRef: String(registrant.ticket_ref ?? '—'),
          })
          return true
        } catch (error) {
          console.error('Event reminder delivery failed for a registrant:', error)
          return false
        }
      }))
      sent += outcomes.filter(Boolean).length
      failed += outcomes.length - outcomes.filter(Boolean).length
      if (i + 10 < registrants.length) await new Promise((resolve) => setTimeout(resolve, 1000))
    }
    const message = failed === 0
      ? `Reminder sent to ${sent} registrant${sent === 1 ? '' : 's'}.`
      : `Sent ${sent} reminder${sent === 1 ? '' : 's'}; ${failed} could not be delivered. You can retry failed deliveries after checking the email service.`
    return NextResponse.json({ success: failed === 0, sent, failed, message }, { headers: { 'Cache-Control': 'private, no-store' } })
  } catch (error) {
    console.error('Admin event reminder request failed:', error)
    return NextResponse.json({ error: 'Could not send event reminders.' }, { status: 500 })
  }
}
