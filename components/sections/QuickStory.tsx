'use client'

// Quick Story section with a word-by-word reading-progress colour animation.
import { useEffect, useRef, useState } from 'react'

const story = 'KAMP started with a question: what happens if someone invests in Nigeria’s student leaders before the world tells them who they’re supposed to become? Since 2018, that question has turned into conferences, campus projects, and a growing community of students who are done waiting for permission to lead.'
const words = story.split(' ')

export default function QuickStory() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isReading, setIsReading] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsReading(true)
          observer.disconnect()
        }
      },
      { threshold: 0.75 }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="bg-brand-gold py-16 lg:py-20">
      <div className="container grid gap-5 lg:grid-cols-[.72fr_1.28fr] lg:gap-16">
        <h2 className="font-display text-3xl leading-none text-brand-black sm:text-6xl">Quick Story</h2>
        <p className="max-w-3xl text-[15px] leading-relaxed sm:text-lg" aria-label={story}>
          {words.map((word, index) => (
            <span key={`${word}-${index}`} className={`transition-colors duration-500 ${isReading ? 'text-brand-black' : 'text-brand-white'}`} style={{ transitionDelay: `${index * 85}ms` }} aria-hidden="true">
              {word}{index < words.length - 1 ? ' ' : ''}
            </span>
          ))}
        </p>
      </div>
    </section>
  )
}
