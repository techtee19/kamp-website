import { notFound } from 'next/navigation'
import CheckinLoginForm from '@/components/checkin/CheckinLoginForm'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function CheckinLoginPage({ searchParams }: { searchParams: Promise<{ event?: string }> }) {
  const { event: eventSlug } = await searchParams
  if (!eventSlug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(eventSlug)) notFound()
  const [event] = await db`SELECT event_title FROM event_tables_registry WHERE event_slug = ${eventSlug} LIMIT 1`
  if (!event) notFound()

  return <main className="flex min-h-screen items-center justify-center bg-brand-cream px-4 py-10">
    <CheckinLoginForm eventSlug={eventSlug} eventTitle={String(event.event_title)} />
  </main>
}
