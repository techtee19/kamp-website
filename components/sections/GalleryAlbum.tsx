'use client'

// An event's photo mosaic, paged by the two arrows in its header.
//
// The grid is a fixed run of slots whose rows each add up to twelve columns — the
// lightbox's "+N" tile closes the last row — so a page has to be exactly full or
// that row ends short. Pages therefore step a whole slot count at a time and the
// final page backs up to finish on the last photo, so a couple of photos repeat
// across that seam rather than leaving a hole in the grid.
import Image from 'next/image'
import { useState } from 'react'
import GalleryLightbox from '@/components/sections/GalleryLightbox'
import type { GalleryEventDocument } from '@/types/sanity'

type GalleryAlbumProps = {
  event: GalleryEventDocument
}

// Column and row spans per slot, in order. Which photo lands in which slot
// depends on the page, so the arrangement stays put as the photos change.
const slots = [
  'col-span-2 row-span-2 md:col-span-2 md:row-span-2',
  'col-span-2 row-span-2 md:col-span-2 md:row-span-2',
  'col-span-2 row-span-2 md:col-span-2 md:row-span-2',
  'col-span-2 row-span-2 md:col-span-2 md:row-span-2',
  'col-span-4 row-span-2 md:col-span-4 md:row-span-2',
  'col-span-2 row-span-2 md:col-span-2 md:row-span-2',
  'col-span-2 row-span-2 md:col-span-3 md:row-span-2',
  'col-span-2 row-span-2 md:col-span-5 md:row-span-2',
  'col-span-2 row-span-2 md:col-span-2 md:row-span-2',
  'col-span-2 row-span-3 md:col-span-2 md:row-span-3',
  'col-span-4 row-span-3 md:col-span-8 md:row-span-3',
  'col-span-2 row-span-3 md:col-span-2 md:row-span-3',
  'col-span-2 row-span-2 md:col-span-5 md:row-span-2',
  'col-span-2 row-span-2 md:col-span-3 md:row-span-2',
]

export default function GalleryAlbum({ event }: GalleryAlbumProps) {
  const [page, setPage] = useState(0)

  const photos = event.photos ?? []
  const pageCount = Math.max(1, Math.ceil(photos.length / slots.length))
  const start = Math.max(0, Math.min(page * slots.length, photos.length - slots.length))
  const visible = photos.slice(start, start + slots.length)
  const hiddenCount = photos.length - visible.length

  // Both arrows wrap, so neither dead-ends on the first or last page and the
  // design keeps two live arrows instead of needing a disabled state.
  const step = (direction: number) => setPage((current) => (current + direction + pageCount) % pageCount)

  return (
    <div className="container max-w-[1200px]">
      <div className="flex items-center justify-between gap-6">
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{event.title}</h2>
        {/* One page of photos means the arrows have nowhere to go. */}
        {pageCount > 1 && (
          <div className="hidden items-center gap-7 md:flex">
            <button type="button" onClick={() => step(-1)} className="rounded-sm transition hover:-translate-x-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold" aria-label="Show previous photos">
              <Image src="/images/gallery/left-arrow.png" alt="" width={38} height={20} className="h-5 w-auto" />
            </button>
            <button type="button" onClick={() => step(1)} className="rounded-sm transition hover:translate-x-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold" aria-label="Show next photos">
              <Image src="/images/gallery/right-arrow.png" alt="" width={38} height={20} className="h-5 w-auto" />
            </button>
          </div>
        )}
      </div>

      {/* The arrows swap the grid in place, which is silent without this. */}
      <p className="sr-only" aria-live="polite">{`Showing photos ${start + 1} to ${start + visible.length} of ${photos.length}`}</p>

      <div className="mt-8 grid auto-rows-[72px] grid-cols-4 gap-3 sm:auto-rows-[88px] md:mt-10 md:auto-rows-[80px] md:grid-cols-12 md:gap-4 lg:auto-rows-[96px]">
        {visible.map((photo, index) => (
          // Keying on the page as well as the photo remounts each tile, which is
          // what replays the fade as a new page comes in.
          <figure key={`${page}-${index}-${photo.asset?.url}`} className={`relative overflow-hidden rounded-2xl bg-brand-card motion-safe:animate-[fade-in_400ms_ease-out] ${slots[index]}`}>
            {/* An image field an editor added but never uploaded to projects as a
                null asset, so that slot keeps the card tint instead of handing
                next/image an undefined src. */}
            {photo.asset?.url && (
              <Image src={photo.asset.url} alt={photo.alt ?? event.title} fill sizes="(min-width: 768px) 20vw, 48vw" className="object-cover transition duration-500 hover:scale-105" />
            )}
          </figure>
        ))}
        {/* With a single page there is nothing behind the tile, and a "+0" tile
            reads as broken — the album is already showing everything. */}
        {hiddenCount > 0 && (
          <GalleryLightbox images={photos} hiddenCount={hiddenCount} title={event.title} backdropUrl={event.coverImage?.asset?.url} />
        )}
      </div>
    </div>
  )
}
