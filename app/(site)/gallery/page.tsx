// KAMP's event gallery. Albums are managed in Sanity Studio; this page only renders them.
import Image from 'next/image'
import GalleryAlbums from '@/components/sections/GalleryAlbums'
import { client } from '@/sanity/lib/client'
import { GALLERY_EVENTS_QUERY } from '@/sanity/lib/queries'
import type { GalleryEventDocument } from '@/types/sanity'

export const revalidate = 3600

function GalleryIntro({ albumCount }: { albumCount: number }) {
  return (
    <section className="container max-w-[1400px] pb-8 pt-28 sm:pb-10 md:pt-32">
      <div className="grid gap-6 md:grid-cols-[1.15fr_.85fr] md:items-end md:gap-12">
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-brand-gold sm:text-sm">KAMP in the moment</p>
          <h1 className="max-w-3xl font-display text-5xl font-semibold leading-[.98] tracking-[-.04em] text-brand-black sm:text-6xl md:text-7xl">
            Our Gallery
            <Image src="/images/yellow-star.png" alt="" width={80} height={80} className="ml-3 inline-block size-10 align-middle sm:ml-4 sm:size-14 md:size-16" />
          </h1>
        </div>
        <div className="flex items-end justify-between gap-5 md:pb-1">
          <p className="max-w-md text-base leading-7 text-brand-grey sm:text-lg">
            A look back at the people, ideas, and moments shaping the KAMP community.
          </p>
          <p className="hidden shrink-0 border-l border-brand-gold/50 pl-4 text-sm text-brand-grey sm:block">
            <span className="block font-display text-3xl font-semibold leading-none text-brand-black">{String(albumCount).padStart(2, '0')}</span>
            {albumCount === 1 ? 'album' : 'albums'}
          </p>
        </div>
      </div>
    </section>
  )
}

export default async function GalleryPage() {
  // The client is null until the Sanity env vars are set, which keeps deployment
  // builds green before the CMS exists; treat it as "nothing published yet".
  const galleryEvents = client
    ? await client.fetch<GalleryEventDocument[]>(GALLERY_EVENTS_QUERY)
    : []
  return (
    <main className="overflow-hidden bg-brand-white text-brand-ink">
      <GalleryIntro albumCount={galleryEvents?.length ?? 0} />
      {galleryEvents && galleryEvents.length > 0 ? (
        <GalleryAlbums events={galleryEvents} />
      ) : (
        <section className="container max-w-[1400px] py-10 md:py-14">
          <div className="relative isolate flex min-h-[360px] items-end overflow-hidden rounded-[1.75rem] bg-brand-black p-7 text-white sm:min-h-[440px] sm:p-10 md:min-h-[500px] md:p-12">
            <Image src="/images/gallery/kamp-gallery/DSC05783.jpg" alt="KAMP community gathered at an event" fill priority sizes="(min-width: 1440px) 1400px, calc(100vw - 2rem)" className="object-cover object-center" />
            <div className="absolute inset-0 -z-0 bg-gradient-to-t from-black/85 via-black/20 to-black/5" />
            <div className="relative z-10">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">Community, connection, growth</p>
              <h2 className="font-display text-3xl font-semibold sm:text-4xl">Moments worth remembering</h2>
              <p className="mt-3 text-white/80">New albums coming soon.</p>
            </div>
          </div>
          <p className="text-center text-brand-grey">No gallery events yet. Check back soon.</p>
        </section>
      )}
    </main>
  )
}
