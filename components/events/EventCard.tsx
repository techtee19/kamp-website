// A single Sanity-managed event as a card, for event grids.
import Image from 'next/image'
import Link from 'next/link'
import type { EventDocument } from '@/types/sanity'

interface EventCardProps {
  event: EventDocument
}

export default function EventCard({ event }: EventCardProps) {
  const date = new Date(event.date).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <article className="group overflow-hidden rounded-xl bg-brand-card">
      <div className="relative aspect-[1.35/1] overflow-hidden">
        {event.coverImage?.asset?.url && (
          <Image
            src={event.coverImage.asset.url}
            alt={event.coverImage.alt ?? event.title}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover transition duration-500 hover:scale-105"
          />
        )}
        <span
          className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold capitalize ${
            event.status === 'upcoming'
              ? 'bg-brand-gold text-brand-black'
              : 'bg-brand-white text-brand-ink'
          }`}
        >
          {event.status}
        </span>
      </div>
      <div className="border-l-4 border-brand-gold p-6">
        <p className="text-sm text-brand-grey">{date}</p>
        <h2 className="mt-3 font-display text-2xl font-semibold">{event.title}</h2>
        <p className="mt-2 text-sm font-medium">{event.university}</p>
        {event.theme && (
          <p className="mt-4 text-sm leading-relaxed text-brand-grey">{event.theme}</p>
        )}
        <Link
          href={`/events/${event.slug.current}`}
          className="mt-6 inline-flex rounded-full bg-brand-ink px-5 py-2 text-sm text-brand-white"
        >
          {event.status === 'upcoming' ? 'View & register' : 'View event'}
        </Link>
      </div>
    </article>
  )
}
