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
  try {
    const table = quoteEventTableName(event.table_name)
    registrations = await db.unsafe(`SELECT id, full_name, email, university, study_level, ticket_ref, checked_in FROM ${table} WHERE status = 'confirmed' ORDER BY full_name ASC`)
  } catch (error) {
    console.error('Admin event check-in page query failed:', error)
    throw error
  }
  return <div className="p-4 sm:p-6 md:p-8">
    <Link href={`/admin/events/${encodeURIComponent(event.event_slug as string)}`} className="mb-4 inline-block text-sm text-brand-grey transition hover:text-brand-black">← Back to registrations</Link>
    <header className="mb-6"><h1 className="font-display text-xl font-bold text-brand-black sm:text-2xl">Check-in: {event.event_title as string}</h1></header>
    <CheckinList eventSlug={event.event_slug as string} registrations={registrations.map((registration) => ({ id: Number(registration.id), fullName: registration.full_name as string, email: registration.email as string, university: registration.university as string, studyLevel: registration.study_level as string, ticketRef: (registration.ticket_ref as string | null) ?? '', checkedIn: Boolean(registration.checked_in) }))} />
  </div>
}
