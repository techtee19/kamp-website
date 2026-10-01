import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { quoteEventTableName } from '@/lib/admin-data'

export const dynamic = 'force-dynamic'

export default async function AdminEventRegistrationsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [event] = await db`SELECT event_id, event_slug, event_title, table_name FROM event_tables_registry WHERE event_slug = ${slug} LIMIT 1`
  if (!event) notFound()

  const table = quoteEventTableName(event.table_name)
  const registrations = await db.unsafe(`SELECT id, full_name, email, phone, university, study_level, status, ticket_ref, created_at FROM ${table} ORDER BY created_at DESC`)
  const csvHref = `/admin/api/events/${encodeURIComponent(slug)}/export`

  return <div className="p-5 sm:p-8">
    <Link href="/admin/events" className="mb-4 inline-block text-sm text-brand-grey transition hover:text-brand-black">← Back to events</Link>
    <header className="mb-6 flex flex-wrap items-center justify-between gap-4"><div><h1 className="font-display text-2xl font-bold text-brand-black">{event.event_title as string}</h1><p className="mt-1 text-sm text-brand-grey">{registrations.length} registration{registrations.length === 1 ? '' : 's'}</p></div><a href={csvHref} className="rounded-full bg-brand-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-black/80">Export CSV</a></header>
    <div className="overflow-hidden rounded-xl border border-brand-card bg-white"><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-brand-card bg-brand-cream text-xs uppercase tracking-widest text-brand-grey">{['Name', 'Email', 'Phone', 'Institution', 'Level', 'Ticket ref', 'Status', 'Registered'].map((heading) => <th key={heading} className="whitespace-nowrap px-4 py-3 font-semibold">{heading}</th>)}</tr></thead><tbody>
      {registrations.length === 0 ? <tr><td colSpan={8} className="px-4 py-12 text-center text-sm text-brand-grey">No registrations for this event.</td></tr> : registrations.map((registration) => <tr key={registration.id as number} className="border-b border-brand-card last:border-0 hover:bg-brand-cream/50"><td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-brand-black">{registration.full_name as string}</td><td className="px-4 py-3 text-sm text-brand-grey">{registration.email as string}</td><td className="whitespace-nowrap px-4 py-3 text-sm text-brand-grey">{registration.phone as string}</td><td className="max-w-48 truncate px-4 py-3 text-sm text-brand-grey" title={registration.university as string}>{registration.university as string}</td><td className="whitespace-nowrap px-4 py-3 text-sm text-brand-grey">{registration.study_level as string}</td><td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-brand-gold">{registration.ticket_ref as string}</td><td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${registration.status === 'confirmed' ? 'bg-green-100 text-green-700' : registration.status === 'waitlisted' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>{registration.status as string}</span></td><td className="whitespace-nowrap px-4 py-3 text-sm text-brand-grey">{new Date(registration.created_at as string).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' })}</td></tr>)}
    </tbody></table></div></div>
  </div>
}
