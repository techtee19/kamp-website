'use client'

// Full-bleed gallery mosaic for the home page, in two arrangements.
//
// Mobile is three static columns, each with its own top offset so the rows read
// as staggered rather than gridded. From `lg` up it becomes two rows that share
// the same column positions and drift together on scroll, so the columns stay
// aligned; varying tile heights plus centre alignment stagger each row's edge.
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

// One column = a top tile and a bottom tile. `ratio` is height / width, so tile
// heights follow the column width at every breakpoint instead of being pinned.
const columns = [
  { top: '/images/gallery/visit-gallery-1.png', topRatio: 1.18, bottom: '/images/gallery/visit-gallery-8.jpg', bottomRatio: 1.21 },
  { top: '/images/gallery/visit-gallery-2.png', topRatio: 1.28, bottom: '/images/gallery/visit-gallery-9.jpg', bottomRatio: 1.24 },
  { top: '/images/gallery/visit-gallery-3.png', topRatio: 1.18, bottom: '/images/gallery/visit-gallery-10.jpg', bottomRatio: 1.36 },
  { top: '/images/gallery/visit-gallery-4.png', topRatio: 1.35, bottom: '/images/gallery/visit-gallery-11.jpg', bottomRatio: 1.09 },
  { top: '/images/gallery/visit-gallery-5.png', topRatio: 1.34, bottom: '/images/gallery/visit-gallery-12.jpg', bottomRatio: 1.15 },
  { top: '/images/gallery/visit-gallery-6.png', topRatio: 1.18, bottom: '/images/gallery/visit-gallery-13.jpg', bottomRatio: 1.24 },
  { top: '/images/gallery/visit-gallery-7.png', topRatio: 1.26, bottom: '/images/gallery/visit-gallery-14.jpg', bottomRatio: 1.3 },
]

// Three copies of the set: we park on the middle one so the row is cut off at
// both edges, and one full set of travel loops back to an identical frame.
const SETS = 3
const SET_SHIFT = 100 / SETS
const TILE_SIZES = '(min-width: 1280px) 224px, (min-width: 1024px) 200px, 176px'

// Mobile arrangement: three columns, each a stack of its own. `offset` is the
// column's head start as a percentage of its width, so the stagger holds at any
// phone size, and `ratio` is height / width so tiles scale with the column.
const mobileColumns = [
  {
    offset: 20,
    tiles: [
      { src: '/images/gallery/visit-gallery-11.jpg', ratio: 1.11 },
      { src: '/images/gallery/visit-gallery-12.jpg', ratio: 1.36 },
      { src: '/images/gallery/visit-gallery-14.jpg', ratio: 1.11 },
      { src: '/images/gallery/visit-gallery-3.png', ratio: 1.11 },
    ],
  },
  {
    offset: 0,
    tiles: [
      { src: '/images/gallery/visit-gallery-4.png', ratio: 1.23 },
      { src: '/images/gallery/visit-gallery-5.png', ratio: 1.24 },
      { src: '/images/gallery/visit-gallery-9.jpg', ratio: 1.24 },
      { src: '/images/gallery/visit-gallery-2.png', ratio: 1.38 },
    ],
  },
  {
    offset: 30,
    tiles: [
      { src: '/images/gallery/visit-gallery-1.png', ratio: 1.02 },
      { src: '/images/gallery/visit-gallery-7.png', ratio: 1.14 },
      { src: '/images/gallery/visit-gallery-6.png', ratio: 1.21 },
      { src: '/images/gallery/visit-gallery-13.jpg', ratio: 1.11 },
    ],
  },
]

type Row = 'top' | 'bottom'

function Tile({ src, ratio, className = 'w-(--tile) shrink-0', sizes = TILE_SIZES }: { src: string; ratio: number; className?: string; sizes?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`} style={{ aspectRatio: `1 / ${ratio}` }}>
      <Image src={src} alt="KAMP gallery moment" fill sizes={sizes} className="object-cover" />
    </div>
  )
}

function MosaicRow({ row, offset }: { row: Row; offset: number }) {
  return (
    <div className="flex w-max items-center gap-2.5 will-change-transform" style={{ transform: `translateX(${offset}%)` }}>
      {Array.from({ length: SETS }, (_, set) => columns.map((column) => (
        <Tile
          key={`${set}-${column[row]}`}
          src={column[row]}
          ratio={row === 'top' ? column.topRatio : column.bottomRatio}
        />
      )))}
    </div>
  )
}

export default function GalleryMarquee() {
  const [scrollPhase, setScrollPhase] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const updatePosition = () => {
      setScrollPhase((window.scrollY / 2400) % 1)
    }

    updatePosition()
    window.addEventListener('scroll', updatePosition, { passive: true })
    window.addEventListener('resize', updatePosition)
    return () => {
      window.removeEventListener('scroll', updatePosition)
      window.removeEventListener('resize', updatePosition)
    }
  }, [])

  // Both rows take the same offset — that is what keeps the columns aligned.
  const offset = -SET_SHIFT - scrollPhase * SET_SHIFT

  return (
    <section className="overflow-hidden bg-brand-white py-14 lg:py-20 [--tile:176px] lg:[--tile:200px] xl:[--tile:224px]">
      <div className="container">
        <h2 className="font-display text-[26px] font-semibold leading-tight text-brand-ink sm:text-4xl">Our Gallery</h2>
      </div>
      <div className="relative isolate mt-6 lg:mt-12">
        {/* Brand star rises out of the top row; the tiles cover its lower half. */}
        <Image src="/images/star.png" alt="" width={96} height={96} className="pointer-events-none absolute -top-8 right-[18%] z-0 size-16 lg:-top-9 lg:size-24" />

        {/* Mobile: the negative margin pushes the outer columns past both edges
            so the mosaic is clipped left and right instead of ending flush. */}
        <div className="relative z-10 -mx-1.5 grid grid-cols-3 items-start gap-x-[3px] lg:hidden">
          {mobileColumns.map((column, index) => (
            <div key={index} className="flex flex-col gap-1" style={{ paddingTop: `${column.offset}%` }}>
              {column.tiles.map((tile) => (
                <Tile key={tile.src} src={tile.src} ratio={tile.ratio} className="w-full" sizes="33vw" />
              ))}
            </div>
          ))}
        </div>

        <div className="relative z-10 hidden flex-col gap-2.5 lg:flex">
          <MosaicRow row="top" offset={offset} />
          <MosaicRow row="bottom" offset={offset} />
        </div>
      </div>
      <div className="mt-7 text-center lg:mt-8">
        <Link href="/gallery" className="inline-block rounded-full bg-brand-ink px-6 py-2.5 text-sm text-brand-white transition hover:bg-brand-deep lg:px-5 lg:py-2 lg:text-xs">Visit full Gallery</Link>
      </div>
    </section>
  )
}
