import { redirect, notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-session'
import { getCheckinOperatorSession } from '@/lib/checkin-access'
import { quoteEventTableName } from '@/lib/admin-data'
import CheckinList from '@/components/admin/CheckinList'
import CheckinLogoutButton from '@/components/checkin/CheckinLogoutButton'

export const dynamic = 'force-dynamic'

export default async function OperatorCheckinPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [event] = await db`SELECT event_slug, event_title, table_name FROM event_tables_registry WHERE event_slug = ${slug} LIMIT 1`
  if (!event) notFound()

  const isAdmin = await getAdminSession()
  const operator = isAdmin ? null : await getCheckinOperatorSession(slug)
  if (!isAdmin && !operator) redirect(`/check-in/login?event=${encodeURIComponent(slug)}`)

  const table = quoteEventTableName(event.table_name)
  const registrations = await db.unsafe(`SELECT id, full_name, email, attendee_type, university, study_level, occupation, organization, member_id, ticket_ref, checked_in FROM ${table} WHERE status = 'confirmed' ORDER BY full_name ASC`)

  return <main className="mx-auto min-h-screen max-w-3xl bg-brand-cream px-4 py-6 sm:px-6 sm:py-9">
    <header className="mb-6 flex items-start justify-between gap-4">
      <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">KAMP · EVENT CHECK-IN</p><h1 className="mt-2 font-display text-2xl font-bold text-brand-black">{event.event_title as string}</h1><p className="mt-2 text-sm text-brand-grey">{isAdmin ? 'Administrator access' : `Check-in operator · ${operator?.email}`}</p></div>
      {!isAdmin && <CheckinLogoutButton eventSlug={slug} />}
    </header>
    <CheckinList eventSlug={slug} operatorOnly={!isAdmin} registrations={registrations.map((registration) => ({ id: Number(registration.id), fullName: String(registration.full_name), email: isAdmin ? String(registration.email) : '', attendeeType: String(registration.attendee_type ?? 'student'), university: (registration.university as string | null) ?? '', studyLevel: (registration.study_level as string | null) ?? '', occupation: (registration.occupation as string | null) ?? '', organization: (registration.organization as string | null) ?? '', memberId: (registration.member_id as string | null) ?? '', ticketRef: (registration.ticket_ref as string | null) ?? '', checkedIn: Boolean(registration.checked_in) }))} />
    <p className="mt-6 text-center text-xs leading-relaxed text-brand-grey">Only confirmed attendees appear here. Please ask the event lead if you need help.</p>
  </main>
}
