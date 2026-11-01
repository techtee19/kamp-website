import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { quoteEventTableName } from '@/lib/admin-data'
import CheckinList from '@/components/admin/CheckinList'

export const dynamic = 'force-dynamic'

export default async function EventCheckinPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [event] = await db`SELECT event_slug, event_title, table_name FROM event_tables_registry WHERE event_slug = ${slug} LIMIT 1`
  if (!event) notFound()

  let registrations
  let activity: { actor_email: string; action: string; ticket_ref: string | null; created_at: string }[] = []
  try {
    const table = quoteEventTableName(event.table_name)
    registrations = await db.unsafe(`SELECT id, full_name, email, attendee_type, university, study_level, occupation, organization, member_id, ticket_ref, checked_in FROM ${table} WHERE status = 'confirmed' ORDER BY full_name ASC`)
    activity = await db`SELECT actor_email, action, ticket_ref, created_at FROM event_checkin_audit WHERE event_slug = ${slug} ORDER BY created_at DESC LIMIT 30`
  } catch (error) {
    console.error('Admin event check-in page query failed:', error)
    throw error
  }
  return <div className="p-4 sm:p-6 md:p-8">
    <Link href={`/admin/events/${encodeURIComponent(event.event_slug as string)}`} className="mb-4 inline-block text-sm text-brand-grey transition hover:text-brand-black">← Back to registrations</Link>
    <header className="mb-6"><h1 className="font-display text-xl font-bold text-brand-black sm:text-2xl">Check-in: {event.event_title as string}</h1></header>
    <CheckinList eventSlug={event.event_slug as string} registrations={registrations.map((registration) => ({ id: Number(registration.id), fullName: registration.full_name as string, email: registration.email as string, attendeeType: String(registration.attendee_type ?? 'student'), university: (registration.university as string | null) ?? '', studyLevel: (registration.study_level as string | null) ?? '', occupation: (registration.occupation as string | null) ?? '', organization: (registration.organization as string | null) ?? '', memberId: (registration.member_id as string | null) ?? '', ticketRef: (registration.ticket_ref as string | null) ?? '', checkedIn: Boolean(registration.checked_in) }))} />
    <section className="mt-8 rounded-xl border border-brand-card bg-white p-5"><h2 className="font-display text-lg font-bold text-brand-black">Recent check-in activity</h2><p className="mt-1 text-sm text-brand-grey">Latest 30 check-in changes for this event.</p><div className="mt-3 divide-y divide-brand-card">{activity.length === 0 ? <p className="py-4 text-sm text-brand-grey">No check-in activity yet.</p> : activity.map((entry, index) => <div key={`${entry.created_at}-${index}`} className="flex flex-wrap justify-between gap-2 py-3 text-sm"><span className="text-brand-black"><strong>{entry.actor_email}</strong> {entry.action === 'checked_in' ? 'checked in' : 'reverted check-in for'} <span className="font-mono text-xs text-brand-gold">{entry.ticket_ref ?? 'ticket'}</span></span><time className="text-xs text-brand-grey">{new Date(entry.created_at).toLocaleString('en-NG')}</time></div>)}</div></section>
  </div>
}
