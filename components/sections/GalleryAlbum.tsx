'use client'

// One event's photo mosaic. The arrows in the header belong to the album pager above,
// which swaps this whole album for the previous or next event's.
//
// The grid is a fixed run of slots whose rows each add up to twelve columns — the
// lightbox's "+N" tile closes the last row — so an album with more photos than slots
// fills the grid exactly and the rest live behind that tile. Albums with fewer photos
// than slots end their last row short, which is the intended look for a small album.
import Image from 'next/image'
import GalleryLightbox from '@/components/sections/GalleryLightbox'
import type { GalleryEventDocument } from '@/types/sanity'

type GalleryAlbumProps = {
  event: GalleryEventDocument
  /** Which album of how many, for the arrows and the live region. */
  position?: { index: number; total: number }
  onPrevious?: () => void
  onNext?: () => void
}

// Column and row spans per slot, in order. Which photo lands in which slot depends on
// the album, so the arrangement stays put as the photos change.
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

export default function GalleryAlbum({
  event,
  position,
  onPrevious,
  onNext,
}: GalleryAlbumProps) {
  const photos = event.photos ?? []
  const visible = photos.slice(0, slots.length)
  const hiddenCount = photos.length - visible.length

  // One album means the arrows have nowhere to go.
  const showArrows = (position?.total ?? 1) > 1

  return (
    <div className="container max-w-[1200px]">
      <div className="flex items-center justify-between gap-6">
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{event.title}</h2>
        {showArrows && (
          // Visible at every breakpoint: these arrows are now the only way to reach
          // another event's album, so hiding them on mobile would strand phone visitors
          // on whichever album happens to be first.
          <div className="flex shrink-0 items-center gap-5 md:gap-7">
            <button type="button" onClick={onPrevious} className="rounded-sm transition hover:-translate-x-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold" aria-label="Show previous event gallery">
              <Image src="/images/gallery/left-arrow.png" alt="" width={38} height={20} className="h-4 w-auto md:h-5" />
            </button>
            <button type="button" onClick={onNext} className="rounded-sm transition hover:translate-x-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold" aria-label="Show next event gallery">
              <Image src="/images/gallery/right-arrow.png" alt="" width={38} height={20} className="h-4 w-auto md:h-5" />
            </button>
          </div>
        )}
      </div>

      {/* The arrows swap the album in place, which is silent without this. */}
      {position && (
        <p className="sr-only" aria-live="polite">{`Showing ${event.title}, gallery ${position.index + 1} of ${position.total}, ${photos.length} photos`}</p>
      )}

      <div className="mt-8 grid auto-rows-[72px] grid-cols-4 gap-3 sm:auto-rows-[88px] md:mt-10 md:auto-rows-[80px] md:grid-cols-12 md:gap-4 lg:auto-rows-[96px]">
        {visible.map((photo, index) => (
          // Keying on the event as well as the photo remounts each tile, which is what
          // replays the fade as a new album comes in.
          <figure key={`${event._id}-${index}-${photo.asset?.url}`} className={`relative overflow-hidden rounded-2xl bg-brand-card motion-safe:animate-[fade-in_400ms_ease-out] ${slots[index]}`}>
            {/* An image field an editor added but never uploaded to projects as a
                null asset, so that slot keeps the card tint instead of handing
                next/image an undefined src. */}
            {photo.asset?.url && (
              <Image src={photo.asset.url} alt={photo.alt ?? event.title} fill sizes="(min-width: 768px) 20vw, 48vw" className="object-cover transition duration-500 hover:scale-105" />
            )}
          </figure>
        ))}
        {/* With every photo already on screen there is nothing behind the tile, and a
            "+0" tile reads as broken. */}
        {hiddenCount > 0 && (
          <GalleryLightbox images={photos} hiddenCount={hiddenCount} title={event.title} backdropUrl={event.coverImage?.asset?.url} />
        )}
      </div>
    </div>
  )
}
