'use client'

// Opens the complete KAMP event gallery from the preview mosaic.
import Image from 'next/image'
import { useEffect, useState } from 'react'

type GalleryLightboxProps = {
  images: string[]
  hiddenCount: number
}

export default function GalleryLightbox({ images, hiddenCount }: GalleryLightboxProps) {
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
        <Image src="/images/gallery/kamp-gallery/DSC06045.jpg" alt="More Emerge 2026 moments" fill sizes="(min-width: 768px) 24vw, 100vw" className="object-cover opacity-45 grayscale transition duration-500 group-hover:scale-105" />
        <span className="relative z-10 grid place-items-center font-display text-5xl font-bold text-brand-white md:text-6xl">+{hiddenCount}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-brand-black/95 px-4 py-6 text-brand-white md:px-8 md:py-10" role="dialog" aria-modal="true" aria-label="Full KAMP gallery">
          <div className="mx-auto max-w-[1400px]">
            <div className="sticky top-0 z-10 mb-6 flex items-center justify-between bg-brand-black/95 py-3 backdrop-blur">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">Emerge 2026</p>
                <h2 className="mt-1 font-display text-3xl font-semibold">Full Gallery</h2>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} className="rounded-full border border-brand-white px-5 py-2 text-sm transition hover:bg-brand-white hover:text-brand-black">Close</button>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {images.map((image) => (
                <figure key={image} className="relative aspect-[.82/1] overflow-hidden rounded-xl bg-brand-card">
                  <Image src={`/images/gallery/kamp-gallery/${image}`} alt="KAMP Emerge 2026 event moment" fill sizes="(min-width: 1280px) 20vw, (min-width: 768px) 33vw, 50vw" className="object-cover" />
                </figure>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
