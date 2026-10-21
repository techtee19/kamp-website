import { ArrowDown, ArrowRight, ArrowUpRight, CalendarDays, MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { freshClient } from '@/sanity/lib/client'
import { PAST_EVENTS_QUERY, UPCOMING_EVENTS_QUERY } from '@/sanity/lib/queries'
import type { EventDocument } from '@/types/sanity'

export const revalidate = 300

const fallbackImage = '/images/gallery/kamp-gallery/DSC08785.jpg'

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

function FeaturedEvent({ event }: { event: EventDocument | null }) {
  const image = event?.coverImage?.asset?.url ?? fallbackImage
  return (
    <section className="container max-w-[1400px] pb-14 sm:pb-20" aria-label={event ? 'Featured upcoming event' : 'Event information'}>
      <div className="group relative isolate min-h-[470px] overflow-hidden rounded-[1.75rem] bg-brand-ink sm:min-h-[540px] lg:min-h-[590px]">
        <Image src={image} alt={event?.coverImage?.alt ?? (event ? event.title : 'KAMP community gathered at an event')} fill priority sizes="(min-width: 1440px) 1400px, 100vw" className="-z-20 object-cover transition-transform duration-700 ease-out group-hover:scale-[1.015] motion-reduce:transform-none motion-reduce:transition-none" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#101722]/90 via-[#101722]/45 to-[#101722]/10" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#101722]/75 via-transparent to-[#101722]/10" />
        <div className="flex min-h-[470px] flex-col justify-between p-6 sm:min-h-[540px] sm:p-10 lg:min-h-[590px] lg:p-14">
          <div className="flex items-start justify-between gap-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
              <span className="size-1.5 rounded-full bg-brand-gold" />{event ? (event.status === 'ongoing' ? 'Happening now' : 'Coming up next') : 'KAMP gatherings'}
            </span>
            <span className="hidden items-center gap-2 text-sm text-white/75 sm:inline-flex">Ideas become impact <ArrowDown aria-hidden="true" className="size-4" /></span>
          </div>
          <div className="max-w-3xl pb-2">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">{event ? formatEventDate(event.date) : 'Learn · connect · lead'}</p>
            <h2 className="font-display text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-5xl lg:text-7xl">
              {event ? event.title : 'Make room for what’s next.'}
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
              {event ? event.theme ?? 'Come learn, connect, and grow with the KAMP community.' : 'Our events bring people together to learn from one another, build meaningful connections, and grow into the leaders their communities need.'}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              {event ? <Link href={`/events/${event.slug.current}`} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-gold px-5 py-3 text-sm font-semibold text-brand-black transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.98] motion-reduce:transition-none">{event.registrationClosed ? 'Explore event' : 'Explore & register'}<ArrowRight aria-hidden="true" className="size-4" /></Link> : <Link href="/gallery" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-gold px-5 py-3 text-sm font-semibold text-brand-black transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.98] motion-reduce:transition-none">Explore KAMP moments<ArrowRight aria-hidden="true" className="size-4" /></Link>}
              {event?.location && <span className="inline-flex items-center gap-2 text-sm text-white/85"><MapPin aria-hidden="true" className="size-4 text-brand-gold" />{event.location}</span>}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default async function EventsPage() {
  const [upcomingEvents, pastEvents] = freshClient
    ? await Promise.all([
        freshClient.fetch<EventDocument[]>(UPCOMING_EVENTS_QUERY),
        freshClient.fetch<EventDocument[]>(PAST_EVENTS_QUERY),
      ])
    : [[], []]

  const featuredEvent = upcomingEvents[0] ?? null
  const remainingUpcoming = upcomingEvents.slice(featuredEvent ? 1 : 0)

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

      <FeaturedEvent event={featuredEvent} />

      <section id="upcoming" className="scroll-mt-24 border-t border-brand-ink/8 bg-white py-14 sm:py-20" aria-labelledby="upcoming-heading">
        <div className="container max-w-[1400px]">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
            <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">Your next opportunity</p><h2 id="upcoming-heading" className="mt-2 font-display text-3xl font-semibold tracking-[-0.035em] text-brand-black sm:text-4xl">Upcoming events</h2></div>
            <span className="text-sm text-brand-grey">{String(upcomingEvents.length).padStart(2, '0')} {upcomingEvents.length === 1 ? 'gathering' : 'gatherings'}</span>
          </div>
          {!featuredEvent ? (
            <div className="rounded-2xl border border-brand-ink/10 bg-brand-cream p-7 sm:p-9"><h3 className="font-display text-xl font-semibold text-brand-ink">No dates announced just yet.</h3><p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-grey">We’re planning what’s next. In the meantime, explore moments from past gatherings and follow KAMP for announcements.</p><Link href="/gallery" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-ink hover:text-brand-gold">Explore the gallery <ArrowRight aria-hidden="true" className="size-4" /></Link></div>
          ) : remainingUpcoming.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{remainingUpcoming.map((event) => <EventCard key={event._id} event={event} />)}</div>
          ) : (
            <p className="rounded-2xl bg-brand-cream px-5 py-4 text-sm text-brand-grey">That’s the next gathering on our calendar. More events will appear here as soon as they’re announced.</p>
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
