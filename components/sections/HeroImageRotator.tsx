'use client'

// Four-image hero background that cross-fades on a four-second cycle.
import Image from 'next/image'
import { useEffect, useState } from 'react'

const heroImages = [
  '/images/hero/kamp-hero1.png',
  '/images/hero/kamp-hero2.png',
  '/images/hero/kamp-hero3.png',
  '/images/hero/kamp-hero4.png',
]

export default function HeroImageRotator() {
  const [activeImage, setActiveImage] = useState(0)
  const [ready, setReady] = useState<number[]>([])
  const [mountedThrough, setMountedThrough] = useState(0)

  useEffect(() => {
    if (!ready.includes(activeImage) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const next = (activeImage + 1) % heroImages.length
    // Let the initial hero finish before requesting the next slide, and keep
    // the current photo visible when the next image is slow to load.
    const prepare = window.setTimeout(() => setMountedThrough((current) => Math.max(current, next)), 300)
    const rotate = ready.includes(next) ? window.setTimeout(() => setActiveImage(next), 4000) : undefined
    return () => { window.clearTimeout(prepare); window.clearTimeout(rotate) }
  }, [activeImage, ready])

  return (
    <div className="absolute inset-0 -z-20" aria-hidden="true">
      {heroImages.slice(0, mountedThrough + 1).map((image, index) => (
        <Image key={image} src={image} alt="" fill loading="eager" fetchPriority={index === 0 ? 'high' : 'low'} sizes="100vw"
          onLoad={() => setReady((loaded) => loaded.includes(index) ? loaded : [...loaded, index])}
          className={`object-cover object-center transition-opacity duration-[1200ms] ease-in-out motion-reduce:transition-none ${index === activeImage ? 'opacity-100' : 'opacity-0'}`} />
      ))}
    </div>
  )
}
