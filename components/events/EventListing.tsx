'use client'

// Filterable KAMP event card grid for the Events listing page.
import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { KampEvent } from '@/lib/event-data'

export default function EventListing({ events }: { events: KampEvent[] }) {
  const [status, setStatus] = useState<'all' | KampEvent['status']>('upcoming')
  const [university, setUniversity] = useState('all')
  const universities = [...new Set(events.map((event) => event.university))]
  const visibleEvents = useMemo(() => events.filter((event) => (status === 'all' || event.status === status) && (university === 'all' || event.university === university)), [events, status, university])

  return (
    <>
      <div className="flex flex-col justify-between gap-5 border-y border-brand-ink/15 py-5 md:flex-row md:items-center">
        <div className="flex flex-wrap gap-2">
          {(['upcoming', 'past', 'all'] as const).map((option) => (
            <button key={option} type="button" onClick={() => setStatus(option)} className={`rounded-full px-5 py-2 text-sm capitalize transition ${status === option ? 'bg-brand-ink text-brand-white' : 'border border-brand-ink/30 text-brand-ink hover:bg-brand-card'}`}>
              {option === 'all' ? 'All events' : option}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-3 text-sm text-brand-grey">University
          <select value={university} onChange={(event) => setUniversity(event.target.value)} className="rounded-full border border-brand-ink/30 bg-brand-white px-4 py-2 text-brand-ink outline-none">
            <option value="all">All universities</option>
            {universities.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visibleEvents.map((event) => (
          <article key={event.slug} className="group overflow-hidden rounded-xl bg-brand-card">
            <div className="relative aspect-[1.35/1] overflow-hidden">
              <Image src={event.image} alt={event.title} fill sizes="(min-width: 1280px) 31vw, (min-width: 768px) 48vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
              <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold capitalize ${event.status === 'upcoming' ? 'bg-brand-gold text-brand-black' : 'bg-brand-white text-brand-ink'}`}>{event.status}</span>
            </div>
            <div className="border-l-4 border-brand-gold p-6">
              <p className="text-sm text-brand-grey">{event.date}{' · '}{event.time}</p>
              <h2 className="mt-3 font-display text-2xl font-semibold">{event.title}</h2>
              <p className="mt-2 text-sm font-medium">{event.university}</p>
              <p className="mt-4 text-sm leading-relaxed text-brand-grey">{event.theme}</p>
              <Link href={`/events/${event.slug}`} className="mt-6 inline-flex rounded-full bg-brand-ink px-5 py-2 text-sm text-brand-white">{event.status === 'upcoming' ? 'View & register' : 'View event'}</Link>
            </div>
          </article>
        ))}
      </div>
      {visibleEvents.length === 0 && <p className="py-16 text-center text-brand-grey">No events match this filter yet.</p>}
    </>
  )
}
