'use client'

// Opens an event's complete photo album from its preview mosaic.
import Image from 'next/image'
import { useEffect, useState } from 'react'
import type { SanityGalleryImage } from '@/types/sanity'

type GalleryLightboxProps = {
  images: SanityGalleryImage[]
  hiddenCount: number
  // The album's own title and cover, so the tile and modal label themselves from
  // Sanity instead of naming one hardcoded event.
  title: string
  backdropUrl?: string
}

export default function GalleryLightbox({ images, hiddenCount, title, backdropUrl }: GalleryLightboxProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} className="group relative col-span-4 row-span-2 grid overflow-hidden rounded-2xl bg-brand-black text-left md:col-span-4 md:row-span-2" aria-label={`View all ${images.length} gallery photos`}>
        {backdropUrl && (
          <Image src={backdropUrl} alt="" fill sizes="(min-width: 768px) 24vw, 100vw" className="object-cover opacity-45 grayscale transition duration-500 group-hover:scale-105" />
        )}
        <span className="relative z-10 grid place-items-center font-display text-5xl font-bold text-brand-white md:text-6xl">+{hiddenCount}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-brand-black/95 px-4 py-6 text-brand-white md:px-8 md:py-10" role="dialog" aria-modal="true" aria-label={`Full ${title} gallery`}>
          <div className="mx-auto max-w-[1400px]">
            <div className="sticky top-0 z-10 mb-6 flex items-center justify-between bg-brand-black/95 py-3 backdrop-blur">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">{title}</p>
                <h2 className="mt-1 font-display text-3xl font-semibold">Full Gallery</h2>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} className="rounded-full border border-brand-white px-5 py-2 text-sm transition hover:bg-brand-white hover:text-brand-black">Close</button>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {images.map((image, index) =>
                // An image field an editor added but never uploaded to projects as a
                // null asset, so skip the tile rather than passing next/image undefined.
                image.asset?.url ? (
                  <figure key={`${index}-${image.asset.url}`} className="relative aspect-[.82/1] overflow-hidden rounded-xl bg-brand-card">
                    <Image src={image.asset.url} alt={image.alt ?? title} fill sizes="(min-width: 1280px) 20vw, (min-width: 768px) 33vw, 50vw" className="object-cover" />
                  </figure>
                ) : null
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
