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

  useEffect(() => {
    const rotation = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % heroImages.length)
    }, 4000)

    return () => window.clearInterval(rotation)
  }, [])

  return (
    <div className="absolute inset-0 -z-20" aria-hidden="true">
      {heroImages.map((image, index) => (
        <Image key={image} src={image} alt="" fill priority={index === 0} sizes="100vw" className={`object-fill transition-opacity duration-[1200ms] ease-in-out md:object-cover ${index === activeImage ? 'opacity-100' : 'opacity-0'}`} />
      ))}
    </div>
  )
}
