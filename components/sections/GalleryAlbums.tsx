'use client'

// A shared event carousel and album viewer. The selected event always drives both
// the cover and the photo grid, so their content cannot drift out of sync.
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import GalleryAlbum from '@/components/sections/GalleryAlbum'
import type { GalleryEventDocument } from '@/types/sanity'

type GalleryAlbumsProps = {
  events: GalleryEventDocument[]
}

const ROTATION_MS = 5000

export default function GalleryAlbums({ events }: GalleryAlbumsProps) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [interacting, setInteracting] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const heroRef = useRef<HTMLElement | null>(null)
  const event = events[index]
  const photos = event.photos ?? []
  const coverUrl = event.coverImage?.asset?.url ?? '/images/gallery/kamp-gallery/DSC05783.jpg'
  const coverAlt = event.coverImage?.alt ?? `Photos from ${event.title}`
  const photoCount =
    photos.length +
    (event.coverImage?.asset?.url && photos[0]?.asset?.url !== event.coverImage.asset.url
      ? 1
      : 0)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setReducedMotion(media.matches)
    updatePreference()
    media.addEventListener('change', updatePreference)
    return () => media.removeEventListener('change', updatePreference)
  }, [])

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return

    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), {
      threshold: 0.25,
    })
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (events.length < 2 || paused || interacting || reducedMotion || !isInView) return

    const rotation = window.setInterval(() => {
      setIndex((current) => (current + 1) % events.length)
    }, ROTATION_MS)

    return () => window.clearInterval(rotation)
  }, [events.length, paused, interacting, reducedMotion, isInView])

  const step = (direction: number) => {
    setPaused(true)
    setIndex((current) => (current + direction + events.length) % events.length)
  }

  const selectEvent = (selectedIndex: number) => {
    setPaused(true)
    setIndex(selectedIndex)
  }

  return (
    <div
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocusCapture={() => setInteracting(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          setInteracting(false)
      }}
    >
      <section
        ref={heroRef}
        aria-label="Featured KAMP gallery events"
        aria-roledescription="carousel"
        className="container max-w-[1400px]"
      >
        <div className="group bg-brand-black relative isolate min-h-[420px] overflow-hidden rounded-[1.75rem] sm:min-h-[500px] md:min-h-[560px]">
          {events.map((item, imageIndex) => {
            const imageUrl =
              item.coverImage?.asset?.url ?? '/images/gallery/kamp-gallery/DSC05783.jpg'
            const imageAlt = item.coverImage?.alt ?? `Photos from ${item.title}`

            return (
              <Image
                key={item._id}
                src={imageUrl}
                alt={imageAlt}
                fill
                priority={imageIndex === 0}
                sizes="(min-width: 1440px) 1400px, calc(100vw - 2rem)"
                className={`object-cover object-center transition-opacity duration-[1000ms] ease-in-out motion-reduce:transition-none ${imageIndex === index ? 'opacity-100' : 'opacity-0'}`}
                aria-hidden={imageIndex !== index}
              />
            )
          })}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/5" />

          <div
            key={event._id}
            className="absolute inset-x-0 bottom-0 flex flex-col gap-7 p-6 text-white motion-safe:animate-[fade-in_500ms_ease-out] sm:p-10 md:flex-row md:items-end md:justify-between md:p-12"
          >
            <div className="max-w-3xl">
              <p className="text-brand-gold mb-3 text-xs font-semibold tracking-[0.2em] uppercase sm:text-sm">
                {event.year} · {event.university}
              </p>
              <h2 className="font-display text-3xl leading-tight font-semibold tracking-[-.025em] sm:text-4xl md:text-5xl">
                {event.title}
              </h2>
              {event.theme && (
                <p className="mt-3 text-sm text-white/80 sm:text-base">{event.theme}</p>
              )}
            </div>

            <div className="flex shrink-0 items-center justify-between gap-5 md:justify-end md:gap-6">
              <p className="text-sm text-white/80">
                <span className="font-display block text-2xl font-semibold text-white">
                  {String(photoCount).padStart(2, '0')}
                </span>
                {photoCount === 1 ? 'photo' : 'photos'}
              </p>
              <a
                href="#event-gallery"
                onClick={() => setPaused(true)}
                className="bg-brand-gold text-brand-black inline-flex min-h-12 items-center gap-3 rounded-full px-6 text-sm font-semibold transition duration-200 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white active:scale-[.98]"
              >
                Explore photos{' '}
                <span aria-hidden="true" className="text-lg">
                  ↓
                </span>
              </a>
            </div>
          </div>

          {events.length > 1 && (
            <div className="absolute top-5 right-5 z-10 flex items-center gap-2 sm:top-7 sm:right-7">
              <button
                type="button"
                onClick={() => setPaused((value) => !value)}
                className="hover:text-brand-black grid size-10 place-items-center rounded-full border border-white/50 bg-black/25 text-white backdrop-blur-sm transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                aria-label={paused ? 'Resume gallery rotation' : 'Pause gallery rotation'}
              >
                <span aria-hidden="true">{paused ? '▶' : 'Ⅱ'}</span>
              </button>
            </div>
          )}
        </div>

        {events.length > 1 && (
          <div
            className="mt-4 flex flex-wrap items-center justify-between gap-4"
            aria-label="Choose a gallery event"
          >
            <div
              className="flex items-center gap-2"
              role="group"
              aria-label="Gallery event navigation"
            >
              <button
                type="button"
                onClick={() => step(-1)}
                className="border-brand-ink/15 text-brand-ink hover:border-brand-ink hover:bg-brand-ink focus-visible:outline-brand-gold grid size-10 place-items-center rounded-full border transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95"
                aria-label="Show previous event gallery"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                className="border-brand-ink/15 text-brand-ink hover:border-brand-ink hover:bg-brand-ink focus-visible:outline-brand-gold grid size-10 place-items-center rounded-full border transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95"
                aria-label="Show next event gallery"
              >
                →
              </button>
              <span
                className="font-display text-brand-ink ml-2 text-sm font-semibold tabular-nums"
                aria-live="polite"
              >
                {String(index + 1).padStart(2, '0')}{' '}
                <span className="text-brand-grey font-normal">
                  / {String(events.length).padStart(2, '0')}
                </span>
              </span>
            </div>
            <div
              className="flex max-w-full flex-wrap items-center justify-end gap-2"
              role="group"
              aria-label="Jump to event"
            >
              {events.map((item, itemIndex) => (
                <button
                  key={item._id}
                  type="button"
                  onClick={() => selectEvent(itemIndex)}
                  className={`focus-visible:outline-brand-gold h-2.5 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 ${itemIndex === index ? 'bg-brand-gold w-8' : 'bg-brand-ink/20 hover:bg-brand-ink/50 w-2.5'}`}
                  aria-label={`Show ${item.title}`}
                  aria-current={itemIndex === index ? 'true' : undefined}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      <section id="event-gallery" className="scroll-mt-24 py-14 sm:py-16 md:py-20 xl:py-24">
        <GalleryAlbum
          event={event}
          position={{ index, total: events.length }}
          onPrevious={() => step(-1)}
          onNext={() => step(1)}
        />
      </section>
    </div>
  )
}
