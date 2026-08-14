// Individual KAMP event details and inline registration experience.
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import RegistrationForm from '@/components/events/RegistrationForm'
import { kampEvents } from '@/lib/event-data'

export default async function EventDetailPage({ params }: PageProps<'/events/[slug]'>) {
  const { slug } = await params
  const event = kampEvents.find((item) => item.slug === slug)

  if (!event) notFound()

  return (
    <div className="overflow-hidden bg-brand-white text-brand-ink">
      <section className="relative isolate min-h-[440px] overflow-hidden bg-brand-black pt-20 md:min-h-[560px]">
        <Image src={event.image} alt={event.title} fill priority sizes="100vw" className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-brand-black/70" />
        <div className="container flex min-h-[440px] max-w-[1200px] flex-col justify-end pb-12 text-brand-white md:min-h-[560px] md:pb-16">
          <Link href="/events" className="mb-auto mt-2 inline-flex w-fit items-center gap-2 text-sm text-brand-white/80 transition hover:text-brand-white">← Back to events</Link>
          <span className={`mb-5 w-fit rounded-full px-4 py-1.5 text-sm font-semibold capitalize ${event.status === 'upcoming' ? 'bg-brand-gold text-brand-black' : 'bg-brand-white text-brand-ink'}`}>{event.status}</span>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">{event.theme}</p>
          <h1 className="mt-3 max-w-4xl font-display text-5xl font-semibold tracking-tight sm:text-6xl md:text-7xl">{event.title}</h1>
        </div>
      </section>

      <section className="py-16 md:py-20 xl:py-24">
        <div className="container grid max-w-[1200px] gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">About this event</p>
            <p className="mt-5 font-display text-2xl leading-relaxed md:text-3xl">{event.description}</p>
            <div className="mt-10 grid gap-5 border-y border-brand-ink/15 py-7 sm:grid-cols-2">
              <div><p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-grey">Date &amp; time</p><p className="mt-2 text-base font-semibold">{event.date}</p><p className="mt-1 text-sm text-brand-grey">{event.time}</p></div>
              <div><p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-grey">Location</p><p className="mt-2 text-base font-semibold">{event.university}</p><p className="mt-1 text-sm text-brand-grey">{event.location}</p></div>
            </div>
          </div>

          <div>
            {event.status === 'upcoming' ? (
              <><p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">Reserve your place</p><h2 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">Register for {event.title}</h2><p className="mt-3 text-sm leading-relaxed text-brand-grey">Complete the form below and we&apos;ll confirm your registration by email.</p><div className="mt-7"><RegistrationForm eventTitle={event.title} registrationClosed={event.registrationClosed} /></div></>
            ) : (
              <div className="rounded-xl border-l-4 border-brand-gold bg-brand-card p-7 md:p-9"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">Event complete</p><h2 className="mt-3 font-display text-3xl font-semibold">This KAMP experience has passed.</h2><p className="mt-4 text-sm leading-relaxed text-brand-grey">Explore our upcoming events to find your next room for growth, connection, and meaningful leadership.</p><Link href="/events" className="mt-6 inline-flex rounded-full bg-brand-ink px-5 py-2.5 text-sm text-brand-white">View upcoming events</Link></div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
