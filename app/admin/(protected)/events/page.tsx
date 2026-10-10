import Link from 'next/link'
import { db } from '@/lib/db'
import { getEventRegistrationCount } from '@/lib/admin-analytics'

export const dynamic = 'force-dynamic'

export default async function AdminEventsPage() {
  const registry = await db`SELECT event_id, event_slug, event_title, table_name, created_at FROM event_tables_registry ORDER BY created_at DESC`
  const events = await Promise.all(registry.map(async (event) => {
    const registrations = await getEventRegistrationCount(event.table_name)
    return {
      event_id: event.event_id as string,
      event_slug: event.event_slug as string,
      event_title: event.event_title as string,
      created_at: event.created_at as string,
      registrationCount: registrations.count,
      registrationTableAvailable: registrations.available,
    }
  }))

  return <div className="p-5 sm:p-8">
    <header className="mb-6"><h1 className="font-display text-2xl font-bold text-brand-black">Events</h1><p className="mt-1 text-sm text-brand-grey">Events with registration tables</p></header>
    <div className="overflow-hidden rounded-xl border border-brand-card bg-white"><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-brand-card bg-brand-cream text-xs uppercase tracking-widest text-brand-grey">{['Event', 'Slug', 'Registrations', 'Created', ''].map((heading, index) => <th key={heading || index} className="whitespace-nowrap px-5 py-3 font-semibold">{heading}</th>)}</tr></thead><tbody>
      {events.length === 0 ? <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-brand-grey">No event registration tables yet.</td></tr> : events.map((event) => <tr key={event.event_id as string} className="border-b border-brand-card last:border-0"><td className="px-5 py-4 text-sm font-semibold text-brand-black">{event.event_title as string}</td><td className="px-5 py-4 font-mono text-xs text-brand-grey">{event.event_slug as string}</td><td className="px-5 py-4"><span className="font-display text-xl font-bold text-brand-gold">{event.registrationCount}</span>{!event.registrationTableAvailable && <p className="mt-1 text-xs text-red-700">Registration table missing</p>}</td><td className="whitespace-nowrap px-5 py-4 text-sm text-brand-grey">{new Date(event.created_at as string).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' })}</td><td className="whitespace-nowrap px-5 py-4">{event.registrationTableAvailable ? <Link href={`/admin/events/${encodeURIComponent(event.event_slug as string)}`} className="text-sm font-semibold text-brand-ink hover:underline">View registrations →</Link> : <span className="text-sm text-brand-grey">Unavailable</span>}</td></tr>)}
    </tbody></table></div></div>
  </div>
}
