import { ArrowRight, ArrowUpRight, CalendarDays, MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { freshClient } from '@/sanity/lib/client'
import { PAST_EVENTS_QUERY, UPCOMING_EVENTS_QUERY } from '@/sanity/lib/queries'
import type { EventDocument } from '@/types/sanity'
import FeaturedEventsCarousel from '@/components/events/FeaturedEventsCarousel'

export const revalidate = 300

function formatEventDate(value: string, options: Intl.DateTimeFormatOptions = {}) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Lagos', ...options,
  }).format(date)
}

function EventCard({ event, concluded = false }: { event: EventDocument; concluded?: boolean }) {
  return (
    <article className="group overflow-hidden rounded-[1.5rem] border border-brand-black/8 bg-white transition-shadow duration-300 hover:shadow-[0_18px_55px_rgba(32,32,32,0.10)] motion-reduce:transition-none">
      <Link href={`/events/${event.slug.current}`} className="relative block aspect-[1.48/1] overflow-hidden bg-brand-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-brand-gold">
        {event.coverImage?.asset?.url ? (
          <Image src={event.coverImage.asset.url} alt={event.coverImage.alt ?? event.title} fill loading="lazy" sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw" className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025] motion-reduce:transform-none motion-reduce:transition-none" />
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#1b2a4a,#35342f_65%,#c49a22)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full border border-white/25 bg-black/35 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
          {concluded ? 'Past gathering' : event.status === 'ongoing' ? 'Happening now' : 'Upcoming'}
        </span>
        <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 text-xs font-medium text-white/90">
          <CalendarDays aria-hidden="true" className="size-4" />{formatEventDate(event.date, { month: 'short' })}
        </span>
      </Link>
      <div className="p-5 sm:p-6">
        <h3 className="font-display text-xl font-semibold leading-tight tracking-[-0.025em] text-brand-ink sm:text-2xl">
          <Link href={`/events/${event.slug.current}`} className="rounded-sm outline-none transition-colors hover:text-brand-gold focus-visible:ring-2 focus-visible:ring-brand-gold">{event.title}</Link>
        </h3>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-brand-grey">
          {event.location && <span className="inline-flex items-center gap-1.5"><MapPin aria-hidden="true" className="size-4 shrink-0 text-brand-gold" />{event.location}</span>}
          {event.university && <span>{event.university}</span>}
        </div>
        {event.theme && <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-brand-grey">{event.theme}</p>}
        <Link href={`/events/${event.slug.current}`} className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-full border border-brand-ink/15 px-4 py-2 text-sm font-semibold text-brand-ink transition-colors hover:border-brand-ink hover:bg-brand-ink hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold active:scale-[0.98] motion-reduce:transition-none">
          {concluded ? 'View event' : event.registrationClosed ? 'Event details' : 'View & register'}
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </article>
  )
}

export default async function EventsPage() {
  const [upcomingEvents, pastEvents] = freshClient
    ? await Promise.all([
        freshClient.fetch<EventDocument[]>(UPCOMING_EVENTS_QUERY),
        freshClient.fetch<EventDocument[]>(PAST_EVENTS_QUERY),
      ])
    : [[], []]

  return (
    <main className="overflow-hidden bg-brand-cream text-brand-ink">
      <header className="container max-w-[1400px] pb-9 pt-28 sm:pb-12 sm:pt-32 xl:pt-36">
        <div className="grid items-end gap-7 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">KAMP · learn together</p>
            <h1 className="mt-4 max-w-3xl font-display text-5xl font-semibold leading-[0.98] tracking-[-0.045em] text-brand-black sm:text-6xl xl:text-7xl">Gather. Grow. <span className="text-brand-gold">Go further.</span></h1>
          </div>
          <div className="max-w-lg lg:justify-self-end">
            <p className="text-base leading-relaxed text-brand-grey sm:text-lg">Find the next room where you can learn, meet your people, and take another step toward the impact you want to make.</p>
            <nav aria-label="Events sections" className="mt-5 flex flex-wrap gap-2">
              <a href="#upcoming" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-brand-ink/15 bg-white px-4 py-2 text-sm font-semibold text-brand-ink transition-colors hover:border-brand-ink active:scale-[0.98] motion-reduce:transition-none">Upcoming <span className="text-brand-grey">{String(upcomingEvents.length).padStart(2, '0')}</span></a>
              <a href="#past" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-brand-ink/15 bg-white px-4 py-2 text-sm font-semibold text-brand-ink transition-colors hover:border-brand-ink active:scale-[0.98] motion-reduce:transition-none">Past events <span className="text-brand-grey">{String(pastEvents.length).padStart(2, '0')}</span></a>
            </nav>
          </div>
        </div>
      </header>

      <FeaturedEventsCarousel events={upcomingEvents} />

      <section id="upcoming" className="scroll-mt-24 border-t border-brand-ink/8 bg-white py-14 sm:py-20" aria-labelledby="upcoming-heading">
        <div className="container max-w-[1400px]">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
            <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">Your next opportunity</p><h2 id="upcoming-heading" className="mt-2 font-display text-3xl font-semibold tracking-[-0.035em] text-brand-black sm:text-4xl">Upcoming events</h2></div>
            <span className="text-sm text-brand-grey">{String(upcomingEvents.length).padStart(2, '0')} {upcomingEvents.length === 1 ? 'gathering' : 'gatherings'}</span>
          </div>
          {upcomingEvents.length === 0 ? (
            <div className="rounded-2xl border border-brand-ink/10 bg-brand-cream p-7 sm:p-9"><h3 className="font-display text-xl font-semibold text-brand-ink">No dates announced just yet.</h3><p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-grey">We’re planning what’s next. In the meantime, explore moments from past gatherings and follow KAMP for announcements.</p><Link href="/gallery" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-ink hover:text-brand-gold">Explore the gallery <ArrowRight aria-hidden="true" className="size-4" /></Link></div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{upcomingEvents.map((event) => <EventCard key={event._id} event={event} />)}</div>
          )}
        </div>
      </section>

      <section id="past" className="scroll-mt-24 py-14 sm:py-20" aria-labelledby="past-heading">
        <div className="container max-w-[1400px]">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
            <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">The moments that stay with us</p><h2 id="past-heading" className="mt-2 font-display text-3xl font-semibold tracking-[-0.035em] text-brand-black sm:text-4xl">Past events</h2></div>
            <span className="text-sm text-brand-grey">{String(pastEvents.length).padStart(2, '0')} {pastEvents.length === 1 ? 'gathering' : 'gatherings'}</span>
          </div>
          {pastEvents.length > 0 ? <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{pastEvents.map((event) => <EventCard key={event._id} event={event} concluded />)}</div> : <p className="rounded-2xl border border-brand-ink/10 bg-white px-5 py-4 text-sm text-brand-grey">Past gatherings will show up here after the event wraps.</p>}
        </div>
      </section>
    </main>
  )
}
