// KAMP's event gallery. All albums are managed in Sanity Studio; this page only
// renders them. The files in public/images/gallery/kamp-gallery/ are no longer
// referenced as gallery content — the one that remains is a hero fallback for when
// Sanity has no cover image to use yet.
import Image from 'next/image'
import GalleryAlbums from '@/components/sections/GalleryAlbums'
import { client } from '@/sanity/lib/client'
import { GALLERY_EVENTS_QUERY } from '@/sanity/lib/queries'
import type { GalleryEventDocument } from '@/types/sanity'

export const revalidate = 3600

// Identical in both the populated and empty states, so it lives in one place.
function GalleryHeading() {
  return (
    <section className="container flex min-h-56 max-w-[1400px] items-end pb-8 pt-28 md:min-h-72 md:pb-10 md:pt-32">
      <h1 className="font-display text-5xl font-semibold tracking-tight text-brand-black sm:text-6xl md:text-7xl">Our Gallery <Image src="/images/yellow-star.png" alt="" width={80} height={80} className="ml-3 inline-block size-14 align-middle sm:size-20 md:ml-5 md:size-24" /></h1>
    </section>
  )
}

export default async function GalleryPage() {
  // The client is null until the Sanity env vars are set, which keeps deployment
  // builds green before the CMS exists; treat it as "nothing published yet".
  const galleryEvents = client
    ? await client.fetch<GalleryEventDocument[]>(GALLERY_EVENTS_QUERY)
    : []

  // If no events in Sanity yet, show empty state
  if (!galleryEvents || galleryEvents.length === 0) {
    return (
      <div className="overflow-hidden bg-brand-white text-brand-ink">
        <GalleryHeading />

        <section className="relative h-64 overflow-hidden bg-brand-black sm:h-80 md:h-[360px]">
          <Image src="/images/gallery/kamp-gallery/DSC05783.jpg" alt="KAMP event audience" fill priority sizes="100vw" className="object-cover object-center grayscale" />
          <div className="absolute inset-0 bg-brand-black/65" />
        </section>

        <section className="py-16 md:py-20 xl:py-24">
          <div className="container max-w-[1200px]">
            <p className="text-brand-grey text-center">
              No gallery events yet. Check back soon.
            </p>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="overflow-hidden bg-brand-white text-brand-ink">
      <GalleryHeading />

      {/* Hero image — cover image of the most recent gallery event, falling back
          to the local file while Sanity has nothing to show. */}
      <section className="relative h-64 overflow-hidden bg-brand-black sm:h-80 md:h-[360px]">
        {galleryEvents[0]?.coverImage?.asset?.url ? (
          <Image src={galleryEvents[0].coverImage.asset.url} alt={galleryEvents[0].coverImage.alt ?? 'KAMP gallery'} fill priority sizes="100vw" className="object-cover object-center grayscale" />
        ) : (
          <Image src="/images/gallery/kamp-gallery/DSC05783.jpg" alt="KAMP event audience" fill priority sizes="100vw" className="object-cover object-center grayscale" />
        )}
        <div className="absolute inset-0 bg-brand-black/65" />
      </section>

      {/* One album at a time; its arrows step between events. The hero above stays on
          the most recent event rather than following the arrows. */}
      <GalleryAlbums events={galleryEvents} />
    </div>
  )
}
