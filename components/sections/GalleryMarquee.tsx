'use client'

// Scroll-responsive two-row gallery marquee for the home page.
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const topImages = [
  '/images/gallery/visit-gallery-1.png',
  '/images/gallery/visit-gallery-2.png',
  '/images/gallery/visit-gallery-3.png',
  '/images/gallery/visit-gallery-4.png',
  '/images/gallery/visit-gallery-5.png',
  '/images/gallery/visit-gallery-6.png',
  '/images/gallery/visit-gallery-7.png',
]

const bottomImages = [
  '/images/gallery/visit-gallery-8.jpg',
  '/images/gallery/visit-gallery-9.jpg',
  '/images/gallery/visit-gallery-10.jpg',
  '/images/gallery/visit-gallery-11.jpg',
  '/images/gallery/visit-gallery-12.jpg',
  '/images/gallery/visit-gallery-13.jpg',
  '/images/gallery/visit-gallery-14.jpg',
]

const topTileSizes = ['h-48 w-28', 'h-[216px] w-44', 'h-48 w-44', 'h-56 w-44', 'h-56 w-44', 'h-48 w-44', 'h-48 w-44']
const bottomTileSizes = ['h-48 w-28', 'h-56 w-44', 'h-56 w-44', 'h-48 w-44', 'h-48 w-44', 'h-56 w-44', 'h-48 w-44']

export default function GalleryMarquee() {
  const [scrollPhase, setScrollPhase] = useState(0)

  useEffect(() => {
    const updatePosition = () => {
      setScrollPhase((window.scrollY / 900) % 1)
    }

    updatePosition()
    window.addEventListener('scroll', updatePosition, { passive: true })
    window.addEventListener('resize', updatePosition)
    return () => {
      window.removeEventListener('scroll', updatePosition)
      window.removeEventListener('resize', updatePosition)
    }
  }, [])

  const topOffset = -33.333 + scrollPhase * 33.333
  const bottomOffset = -33.333 - scrollPhase * 33.333

  return (
    <section className="overflow-hidden bg-brand-white py-16 lg:py-20">
      <div className="flex flex-col gap-2">
        <div className="flex w-max gap-2 will-change-transform" style={{ transform: `translateX(${topOffset}%)` }}>
          {Array.from({ length: 3 }, (_, group) => topImages.map((image, index) => (
            <div key={`${group}-${image}`} className={`relative shrink-0 overflow-hidden rounded ${topTileSizes[index]}`}>
              <Image src={image} alt="KAMP gallery moment" fill sizes="176px" className="object-cover" />
            </div>
          )))}
        </div>
        <div className="flex w-max gap-2 will-change-transform" style={{ transform: `translateX(${bottomOffset}%)` }}>
          {Array.from({ length: 3 }, (_, group) => bottomImages.map((image, index) => (
            <div key={`${group}-${image}`} className={`relative shrink-0 overflow-hidden rounded ${bottomTileSizes[index]}`}>
              <Image src={image} alt="KAMP gallery moment" fill sizes="176px" className="object-cover" />
            </div>
          )))}
        </div>
      </div>
      <div className="mt-8 text-center">
        <Link href="/gallery" className="inline-block rounded-full bg-brand-ink px-5 py-2 text-xs text-brand-white transition hover:bg-brand-deep">Visit full Gallery</Link>
      </div>
    </section>
  )
}
