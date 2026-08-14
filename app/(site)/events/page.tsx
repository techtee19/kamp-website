// KAMP's editorial events page with upcoming and concluded gatherings.
import { Play } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const introduction =
  'KAMP was founded on a simple conviction: potential is everywhere, but guidance is not. Across Africa, brilliant young people carry big dreams — yet too many walk the journey alone, without someone ahead of them to say, “this is the way.” The Kolade Adepoju Mentoring Program exists to close that gap.'

const upcomingEvents = [
  {
    title: 'Every great leader was once mentored',
    image: '/images/gallery/kamp-gallery/DSC06240.jpg',
    href: '/events/emerge-2026',
  },
  {
    title: 'CONCLAVE (2026)',
    image: '/images/gallery/kamp-gallery/DSC06037.jpg',
    href: '/events/campus-leadership-forum',
  },
]

const concludedEvents = [
  {
    title: 'Emerge Conference (2026)',
    image: '/images/gallery/kamp-gallery/DSC06118.jpg',
    href: '/events/emerge-2025',
  },
  {
    title: 'Shine your light ted talk (2025).',
    image: '/images/gallery/kamp-gallery/DSC05771.jpg',
    href: '/events/mentors-roundtable-2025',
  },
]

function EventRow({
  event,
  concluded = false,
}: {
  event: { title: string; image: string; href: string }
  concluded?: boolean
}) {
  return (
    <article className="grid items-center gap-7 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-10 xl:gap-14">
      <div className="bg-brand-card relative aspect-[1.62/1] overflow-hidden rounded-2xl">
        <Image
          src={event.image}
          alt={event.title}
          fill
          sizes="(min-width: 768px) 42vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="max-w-[540px]">
        <h2 className="font-display text-brand-ink text-2xl leading-tight font-semibold sm:text-3xl xl:text-[34px]">
          {event.title}
        </h2>
        <p className="text-brand-ink/85 mt-4 text-sm leading-relaxed sm:text-base">
          {introduction}
        </p>
        <Link
          href={event.href}
          className="bg-brand-ink text-brand-white hover:bg-brand-deep mt-6 inline-flex items-center gap-3 rounded-full px-5 py-2.5 text-sm transition"
        >
          {concluded ? 'Watch on youtube' : 'Register'}
          {concluded && <Play size={14} fill="currentColor" />}
        </Link>
      </div>
    </article>
  )
}

export default function EventsPage() {
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

      <section className="container max-w-[1200px] py-16 sm:py-20 xl:py-24">
        <h2 className="font-display text-brand-ink text-3xl leading-tight font-semibold sm:text-4xl xl:text-5xl">
          Upcoming events
        </h2>
        <div className="mt-8 space-y-12 sm:mt-10 sm:space-y-14 xl:mt-12 xl:space-y-16">
          {upcomingEvents.map((event) => (
            <EventRow key={event.title} event={event} />
          ))}
        </div>
      </section>

      <section className="container max-w-[1200px] pt-3 pb-20 sm:pb-24 xl:pt-5 xl:pb-32">
        <h2 className="font-display text-brand-ink text-3xl leading-tight font-semibold sm:text-4xl xl:text-5xl">
          Concluded events
        </h2>
        <div className="mt-8 space-y-12 sm:mt-10 sm:space-y-14 xl:mt-12 xl:space-y-16">
          {concludedEvents.map((event) => (
            <EventRow key={event.title} event={event} concluded />
          ))}
        </div>
      </section>
    </main>
  )
}
