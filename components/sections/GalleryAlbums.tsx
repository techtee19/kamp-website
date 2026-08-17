'use client'

// The gallery's album pager. One album shows at a time and the two arrows step between
// events, so a season of galleries reads as pages rather than one endless scroll.
//
// Photos beyond the mosaic's fourteen slots are not paged here — the album's "+N" tile
// opens the full set in the lightbox, which leaves the arrows to mean one thing only.
import { useState } from 'react'
import GalleryAlbum from '@/components/sections/GalleryAlbum'
import type { GalleryEventDocument } from '@/types/sanity'

type GalleryAlbumsProps = {
  events: GalleryEventDocument[]
}

export default function GalleryAlbums({ events }: GalleryAlbumsProps) {
  const [index, setIndex] = useState(0)

  // Both arrows wrap, so neither dead-ends on the first or last album and the design
  // keeps two live arrows instead of needing a disabled state.
  const step = (direction: number) =>
    setIndex((current) => (current + direction + events.length) % events.length)

  // A shrinking dataset (an album unpublished between renders) must not index past the
  // end, and the page only renders this component when there is at least one event.
  const event = events[Math.min(index, events.length - 1)]

  return (
    <section className="py-16 md:py-20 xl:py-24">
      <GalleryAlbum
        event={event}
        position={{ index, total: events.length }}
        onPrevious={() => step(-1)}
        onNext={() => step(1)}
      />
    </section>
  )
}
