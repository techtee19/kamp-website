'use client'

import { useEffect, useState } from 'react'
import { ArrowDown, ArrowRight, ChevronLeft, ChevronRight, MapPin, Pause, Play } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { EventDocument } from '@/types/sanity'

const fallbackImage = '/images/gallery/kamp-gallery/DSC08785.jpg'

function formatEventDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Lagos',
  }).format(date)
}

export default function FeaturedEventsCarousel({ events }: { events: EventDocument[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduceMotion(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (events.length < 2 || paused || hovered || focused || reduceMotion) return
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % events.length)
    }, 6000)
    return () => window.clearInterval(timer)
  }, [events.length, paused, hovered, focused, reduceMotion])

  const activeEvent = events[activeIndex] ?? null
  const move = (direction: number) => {
    setActiveIndex((index) => (index + direction + events.length) % events.length)
  }

  return (
    <section className="container max-w-[1400px] pb-14 sm:pb-20" aria-label="Upcoming events">
      <div
        className="relative isolate min-h-[470px] overflow-hidden rounded-[1.75rem] bg-brand-ink sm:min-h-[540px] lg:min-h-[590px]"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false)
        }}
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured upcoming events"
      >
        {events.length > 0 ? events.map((event, index) => {
          const isActive = index === activeIndex
          return (
            <div
              key={event._id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out motion-reduce:transition-none ${isActive ? 'z-0 opacity-100' : 'z-[-1] opacity-0'}`}
              aria-hidden={!isActive}
              inert={!isActive}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${events.length}: ${event.title}`}
            >
              <Image
                src={event.coverImage?.asset?.url ?? fallbackImage}
                alt={event.coverImage?.alt ?? event.title}
                fill
                preload={index === 0}
                loading={index === 0 ? undefined : 'lazy'}
                sizes="(min-width: 1440px) 1400px, 100vw"
                className="-z-20 object-cover"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#101722]/90 via-[#101722]/45 to-[#101722]/10" />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#101722]/75 via-transparent to-[#101722]/10" />
              <div className="flex min-h-[470px] flex-col justify-between p-6 sm:min-h-[540px] sm:p-10 lg:min-h-[590px] lg:p-14">
                <div className="flex items-start justify-between gap-4">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                    <span className="size-1.5 rounded-full bg-brand-gold" />{event.status === 'ongoing' ? 'Happening now' : 'Coming up next'}
                  </span>
                  <span className="hidden items-center gap-2 text-sm text-white/75 sm:inline-flex">Ideas become impact <ArrowDown aria-hidden="true" className="size-4" /></span>
                </div>
                <div className="max-w-3xl pb-2">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">{formatEventDate(event.date)}</p>
                  <h2 className="font-display text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-5xl lg:text-7xl">{event.title}</h2>
                  <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">{event.theme ?? 'Come learn, connect, and grow with the KAMP community.'}</p>
                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    <Link href={`/events/${event.slug.current}`} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-gold px-5 py-3 text-sm font-semibold text-brand-black transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.98] motion-reduce:transition-none">
                      {event.registrationClosed ? 'Explore event' : 'Explore & register'}<ArrowRight aria-hidden="true" className="size-4" />
                    </Link>
                    {event.location && <span className="inline-flex items-center gap-2 text-sm text-white/85"><MapPin aria-hidden="true" className="size-4 text-brand-gold" />{event.location}</span>}
                  </div>
                </div>
              </div>
            </div>
          )
        }) : (
          <div className="absolute inset-0 bg-[linear-gradient(125deg,#17233b,#35342f_65%,#8f7220)]">
            <div className="flex min-h-[470px] flex-col justify-end p-6 sm:min-h-[540px] sm:p-10 lg:min-h-[590px] lg:p-14">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">Learn · connect · lead</p>
              <h2 className="max-w-3xl font-display text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-5xl lg:text-7xl">Make room for what’s next.</h2>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">Our events bring people together to learn from one another, build meaningful connections, and grow into the leaders their communities need.</p>
              <Link href="/gallery" className="mt-7 inline-flex min-h-12 w-fit items-center gap-2 rounded-full bg-brand-gold px-5 py-3 text-sm font-semibold text-brand-black">Explore KAMP moments<ArrowRight aria-hidden="true" className="size-4" /></Link>
            </div>
          </div>
        )}

        {events.length > 1 && (
          <div className="absolute bottom-5 right-5 z-10 flex items-center gap-2 rounded-full border border-white/20 bg-black/35 p-1.5 text-white backdrop-blur-md sm:bottom-8 sm:right-8">
            <span className="min-w-14 px-2 text-center font-mono text-xs tabular-nums" aria-live="off">{String(activeIndex + 1).padStart(2, '0')} / {String(events.length).padStart(2, '0')}</span>
            <button type="button" onClick={() => move(-1)} className="grid size-9 place-items-center rounded-full transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-white" aria-label="Previous upcoming event"><ChevronLeft aria-hidden="true" className="size-4" /></button>
            <button type="button" onClick={() => move(1)} className="grid size-9 place-items-center rounded-full transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-white" aria-label="Next upcoming event"><ChevronRight aria-hidden="true" className="size-4" /></button>
            <button type="button" onClick={() => setPaused((value) => !value)} className="grid size-9 place-items-center rounded-full transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-white" aria-label={paused ? 'Resume event rotation' : 'Pause event rotation'} aria-pressed={paused}>
              {paused ? <Play aria-hidden="true" className="size-3.5" /> : <Pause aria-hidden="true" className="size-3.5" />}
            </button>
          </div>
        )}
      </div>
      {activeEvent && <p className="sr-only" aria-live="polite">Featured event: {activeEvent.title}</p>}
    </section>
  )
}
