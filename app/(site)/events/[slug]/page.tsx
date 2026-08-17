// Individual KAMP event details and inline registration experience.
// Content is managed in Sanity Studio; this page only renders it.
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import RegistrationForm from '@/components/events/RegistrationForm'
import { client } from '@/sanity/lib/client'
import { EVENT_BY_SLUG_QUERY, EVENT_SLUGS_QUERY } from '@/sanity/lib/queries'
import type { EventDocument } from '@/types/sanity'

export const revalidate = 3600

// The description is Portable Text, so paragraphs need explicit styling to keep
// the large editorial look the hardcoded copy used to have.
const descriptionComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mt-5 font-display text-2xl leading-relaxed md:text-3xl">
        {children}
      </p>
    ),
  },
}

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('en-NG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

const formatTime = (value: string) =>
  new Date(value).toLocaleTimeString('en-NG', {
    hour: 'numeric',
    minute: '2-digit',
  })

// Pre-generate pages for all known published events.
export async function generateStaticParams() {
  if (!client) return []

  const events = await client.fetch<{ slug: { current: string } }[]>(
    EVENT_SLUGS_QUERY
  )

  return events.map((event) => ({ slug: event.slug.current }))
}

export default async function EventDetailPage({
  params,
}: PageProps<'/events/[slug]'>) {
  const { slug } = await params

  // Without Sanity configured there is nothing to look up, so the route 404s
  // rather than throwing during a build.
  const event = client
    ? await client.fetch<EventDocument | null>(EVENT_BY_SLUG_QUERY, { slug })
    : null

  if (!event) notFound()

  const isUpcoming = event.status === 'upcoming'

  return (
    <div className="overflow-hidden bg-brand-white text-brand-ink">
      <section className="relative isolate min-h-[440px] overflow-hidden bg-brand-black pt-20 md:min-h-[560px]">
        {event.coverImage?.asset?.url && (
          <Image
            src={event.coverImage.asset.url}
            alt={event.coverImage.alt ?? event.title}
            fill
            priority
            sizes="100vw"
            className="-z-20 object-cover"
          />
        )}
        <div className="absolute inset-0 -z-10 bg-brand-black/70" />
        <div className="container flex min-h-[440px] max-w-[1200px] flex-col justify-end pb-12 text-brand-white md:min-h-[560px] md:pb-16">
          <Link href="/events" className="mb-auto mt-2 inline-flex w-fit items-center gap-2 text-sm text-brand-white/80 transition hover:text-brand-white">← Back to events</Link>
          <span className={`mb-5 w-fit rounded-full px-4 py-1.5 text-sm font-semibold capitalize ${isUpcoming ? 'bg-brand-gold text-brand-black' : 'bg-brand-white text-brand-ink'}`}>{event.status}</span>
          {event.theme && <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">{event.theme}</p>}
          <h1 className="mt-3 max-w-4xl font-display text-5xl font-semibold tracking-tight sm:text-6xl md:text-7xl">{event.title}</h1>
        </div>
      </section>

      <section className="py-16 md:py-20 xl:py-24">
        <div className="container grid max-w-[1200px] gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">About this event</p>
            {event.description && (
              <PortableText value={event.description} components={descriptionComponents} />
            )}
            <div className="mt-10 grid gap-5 border-y border-brand-ink/15 py-7 sm:grid-cols-2">
              <div><p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-grey">Date &amp; time</p><p className="mt-2 text-base font-semibold">{formatDate(event.date)}</p><p className="mt-1 text-sm text-brand-grey">{formatTime(event.date)}</p></div>
              <div><p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-grey">Location</p><p className="mt-2 text-base font-semibold">{event.university}</p><p className="mt-1 text-sm text-brand-grey">{event.location}</p></div>
            </div>
          </div>

          <div>
            {isUpcoming ? (
              <><p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">Reserve your place</p><h2 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">Register for {event.title}</h2><p className="mt-3 text-sm leading-relaxed text-brand-grey">Complete the form below and we&apos;ll confirm your registration by email.</p><div className="mt-7"><RegistrationForm eventId={event._id} eventTitle={event.title} eventDate={formatDate(event.date)} eventLocation={event.location} capacity={event.capacity} /></div></>
            ) : (
              <div className="rounded-xl border-l-4 border-brand-gold bg-brand-card p-7 md:p-9"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">Event complete</p><h2 className="mt-3 font-display text-3xl font-semibold">This KAMP experience has passed.</h2><p className="mt-4 text-sm leading-relaxed text-brand-grey">Explore our upcoming events to find your next room for growth, connection, and meaningful leadership.</p><Link href="/events" className="mt-6 inline-flex rounded-full bg-brand-ink px-5 py-2.5 text-sm text-brand-white">View upcoming events</Link></div>
            )}
          </div>
        </div>
      </section>

      {event.galleryImages && event.galleryImages.length > 0 && (
        <section className="pb-16 md:pb-20 xl:pb-24">
          <div className="container max-w-[1200px]">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">Event gallery</p>
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {event.galleryImages.map((image) =>
                image.asset?.url ? (
                  <figure key={image.asset.url} className="relative aspect-[.82/1] overflow-hidden rounded-xl bg-brand-card">
                    <Image src={image.asset.url} alt={image.alt ?? `${event.title} photo`} fill sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw" className="object-cover" />
                  </figure>
                ) : null
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
