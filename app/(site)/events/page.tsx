// KAMP's editorial events page with upcoming and concluded gatherings.
// Content is managed in Sanity Studio; this page only renders it.
import { Play } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { PAST_EVENTS_QUERY, UPCOMING_EVENTS_QUERY } from '@/sanity/lib/queries'
import type { EventDocument } from '@/types/sanity'

export const revalidate = 3600

// Shown in the row's paragraph slot when an event has no theme of its own yet.
const introduction =
  'KAMP was founded on a simple conviction: potential is everywhere, but guidance is not. Across Africa, brilliant young people carry big dreams yet too many walk the journey alone, without someone ahead of them to say, “this is the way.” The Kolade Adepoju Mentoring Program exists to close that gap.'

function EventRow({
  event,
  concluded = false,
}: {
  event: EventDocument
  concluded?: boolean
}) {
  return (
    <article className="grid items-center gap-7 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-10 xl:gap-14">
      <div className="bg-brand-card relative aspect-[1.62/1] overflow-hidden rounded-2xl">
        {/* No placeholder asset exists, so a cover-less event just shows the
            card tint rather than requesting a file that would 404. */}
        {event.coverImage?.asset?.url && (
          <Image
            src={event.coverImage.asset.url}
            alt={event.coverImage.alt ?? event.title}
            fill
            sizes="(min-width: 768px) 42vw, 100vw"
            className="object-cover"
          />
        )}
      </div>
      <div className="max-w-[540px]">
        <h2 className="font-display text-brand-ink text-2xl leading-tight font-semibold sm:text-3xl xl:text-[34px]">
          {event.title}
        </h2>
        <p className="text-brand-ink/85 mt-4 text-sm leading-relaxed sm:text-base">
          {event.theme ?? introduction}
        </p>
        <Link
          href={`/events/${event.slug.current}`}
          className="bg-brand-ink text-brand-white hover:bg-brand-deep mt-6 inline-flex items-center gap-3 rounded-full px-5 py-2.5 text-sm transition"
        >
          {concluded
            ? 'Watch on youtube'
            : event.registrationClosed
              ? 'View event'
              : 'Register'}
          {concluded && <Play size={14} fill="currentColor" />}
        </Link>
      </div>
    </article>
  )
}

export default async function EventsPage() {
  // The client is null until the Sanity env vars are set, which keeps builds
  // green before the CMS exists; treat it as "nothing published yet".
  const [upcomingEvents, pastEvents] = client
    ? await Promise.all([
        client.fetch<EventDocument[]>(UPCOMING_EVENTS_QUERY),
        client.fetch<EventDocument[]>(PAST_EVENTS_QUERY),
      ])
    : [[], []]

  const hasUpcoming = upcomingEvents.length > 0
  const hasPast = pastEvents.length > 0

  return (
    <main className="bg-brand-white text-brand-ink overflow-hidden">
      <section className="container max-w-[1400px] pt-28 pb-7 sm:pt-32 sm:pb-9 xl:pt-36 xl:pb-11">
        <h1 className="font-display text-brand-black text-5xl leading-none font-semibold sm:text-6xl xl:text-7xl">
          Events
        </h1>
      </section>

      <section className="bg-brand-black relative h-[250px] overflow-visible sm:h-[330px] xl:h-[410px]">
        <Image
          src="/images/gallery/kamp-gallery/DSC08785.jpg"
          alt="KAMP speaker at an event"
          fill
          priority
          sizes="100vw"
          className="object-cover grayscale"
        />
        <div className="bg-brand-black/35 absolute inset-0" />
        <Image
          src="/images/yellow-star.png"
          alt=""
          width={160}
          height={160}
          className="pointer-events-none absolute top-0 right-[18%] z-10 size-20 -translate-y-1/2 sm:size-28 xl:size-36"
        />
      </section>

      {!hasUpcoming && !hasPast ? (
        <div className="py-20 text-center">
          <p className="text-brand-grey">
            No events yet. Check back soon or follow us on Instagram @wearekamp.
          </p>
        </div>
      ) : (
        <>
          {hasUpcoming && (
            <section className="container max-w-[1200px] py-16 sm:py-20 xl:py-24">
              <h2 className="font-display text-brand-ink text-3xl leading-tight font-semibold sm:text-4xl xl:text-5xl">
                Upcoming events
              </h2>
              <div className="mt-8 space-y-12 sm:mt-10 sm:space-y-14 xl:mt-12 xl:space-y-16">
                {upcomingEvents.map((event) => (
                  <EventRow key={event._id} event={event} />
                ))}
              </div>
            </section>
          )}

          {hasPast && (
            <section className="container max-w-[1200px] pt-3 pb-20 sm:pb-24 xl:pt-5 xl:pb-32">
              <h2 className="font-display text-brand-ink text-3xl leading-tight font-semibold sm:text-4xl xl:text-5xl">
                Concluded events
              </h2>
              <div className="mt-8 space-y-12 sm:mt-10 sm:space-y-14 xl:mt-12 xl:space-y-16">
                {pastEvents.map((event) => (
                  <EventRow key={event._id} event={event} concluded />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  )
}
