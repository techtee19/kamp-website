'use client'

// Selectable testimonials with a cropped background star detail.
//
// Every breakpoint runs the same scene as "Take action": a tall runway pins the
// panel to the viewport and scroll progress through the runway advances the
// active testimonial, so the strips grow and shrink as you scroll. Tapping a
// strip still works; the next scroll takes the wheel back.
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const testimonials = [
  { name: 'Popoola Deborah', role: 'Computer scientist, content creator', image: '/images/gallery/visit-gallery-1.png', quote: 'KAMP started with a question: what happens if someone invests in Nigeria’s student leaders before the world tells them who they’re supposed to become? Since 2018, that question has turned into conferences, campus projects, and a growing community of students who are done waiting for permission to lead.' },
  { name: 'KAMP Alumnus', role: 'Student leader', image: '/images/gallery/visit-gallery-2.png', quote: 'KAMP gave me the confidence to speak up, build with others, and take responsibility for the change I wanted to see on campus.' },
  { name: 'KAMP Mentor', role: 'Volunteer mentor', image: '/images/gallery/visit-gallery-3.png', quote: 'The conversations at KAMP are honest and practical. You meet students who are ready to translate ambition into service and meaningful action.' },
  { name: 'Campus Partner', role: 'University partner', image: '/images/gallery/visit-gallery-4.png', quote: 'Seeing our students return from KAMP with clearer goals and a deeper commitment to their community is the kind of impact every campus needs.' },
  { name: 'KAMP Volunteer', role: 'Community volunteer', image: '/images/gallery/visit-gallery-5.png', quote: 'Showing up for students through KAMP is a practical way to help shape leaders who are ready to serve where they are needed most.' },
]

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [scenePosition, setScenePosition] = useState<'before' | 'pinned' | 'after'>('before')
  const scrollSectionRef = useRef<HTMLDivElement>(null)
  const active = testimonials[activeIndex]

  // Only the scroll position drives the active index, so the runway is the same
  // at every width; the guard keeps this inert if the scene is ever hidden.
  useEffect(() => {
    let frame = 0

    const updateActiveIndex = () => {
      const section = scrollSectionRef.current
      if (!section || section.offsetParent === null) return

      const sectionTop = section.getBoundingClientRect().top + window.scrollY
      const scrollDistance = Math.max(section.offsetHeight - window.innerHeight, 1)
      const relativeScroll = window.scrollY - sectionTop
      const progress = Math.min(1, Math.max(0, relativeScroll / scrollDistance))

      setScenePosition(
        relativeScroll < 0 ? 'before' : relativeScroll > scrollDistance ? 'after' : 'pinned'
      )
      setActiveIndex(
        Math.min(testimonials.length - 1, Math.floor(progress * testimonials.length))
      )
    }

    const handleScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(updateActiveIndex)
    }

    updateActiveIndex()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  // One tree for every width. Mobile fills the pinned screen with a flex column
  // — the strips take whatever height the heading and the quote card leave over,
  // sharing it 4:1 between active and inactive — so the scene never outgrows a
  // phone viewport. From `md` up the strips go back to fixed heights.
  const panel = (
    <>
      <Image src="/images/star.png" alt="" width={36} height={36} className="pointer-events-none absolute -right-10 top-6 z-0 size-28 md:-right-8 md:top-10" />
      <div className="container relative z-10 flex min-h-0 w-full max-w-[800px] flex-1 flex-col py-6 md:block md:flex-none md:py-0 xl:max-w-[1200px]">
        <h2 className="shrink-0 font-display text-[26px] font-semibold leading-tight text-brand-ink md:text-2xl xl:text-3xl">Here&apos;s what people think of KAMP</h2>
        <div className="mt-5 flex min-h-0 flex-1 flex-col gap-4 md:grid md:grid-cols-[168px_1fr] md:items-center md:gap-6 xl:mt-8 xl:grid-cols-[280px_1fr] xl:gap-10">
          <div className="flex min-h-0 flex-1 flex-col gap-1.5 md:grid md:flex-none">
            {testimonials.map((testimonial, index) => (
              <button key={testimonial.name} type="button" onClick={() => setActiveIndex(index)} className={`relative min-h-0 basis-0 overflow-hidden rounded-lg text-left transition-[height,flex-grow,opacity] duration-300 ease-out md:basis-auto md:grow-0 ${index === activeIndex ? 'grow-4 md:h-32 xl:h-52' : 'grow opacity-80 hover:opacity-100 md:h-6 xl:h-10'}`} aria-label={`Show testimonial from ${testimonial.name}`} aria-pressed={index === activeIndex}>
                <Image src={testimonial.image} alt="" fill sizes="(min-width: 1280px) 280px, (min-width: 768px) 168px, 100vw" className="object-cover grayscale" />
                <span className="absolute inset-0 bg-brand-black/55" />
              </button>
            ))}
          </div>

          <article className="shrink-0 rounded-xl bg-brand-card p-3 md:p-5 xl:p-8">
            {/* TODO: replace placeholder quotes with verified KAMP testimonials. */}
            {/* The mobile floor under the quote keeps every card the same height,
                so the strips above hold still while the scene advances. */}
            <blockquote key={active.name} className="min-h-30 text-[13px] leading-[20px] text-brand-deep motion-safe:animate-[fade-in_400ms_ease-out] md:min-h-0 md:text-xs md:leading-[1.35] xl:text-sm xl:leading-relaxed">{active.quote}</blockquote>
            <div className="mt-5 flex items-end justify-between gap-4 xl:mt-8">
              <div>
                <p className="font-display text-[17px] font-semibold text-brand-ink md:text-xl xl:text-2xl">{active.name}</p>
                <p className="mt-1 max-w-[120px] text-xs text-brand-grey md:max-w-none md:text-[10px] xl:text-xs">{active.role}</p>
              </div>
              <Link href="/get-involved" className="shrink-0 rounded-full bg-brand-ink px-5 py-2 text-xs text-brand-white md:px-4 md:py-1.5 md:text-[10px] xl:px-6 xl:py-2.5 xl:text-xs">Join KAMP</Link>
            </div>
          </article>
        </div>
      </div>
    </>
  )

  return (
    /* The runway gives each testimonial roughly the same slice of scroll as a
       "Take action" tab, plus a closing screen for the panel to leave on. */
    <div ref={scrollSectionRef} className="relative h-[425vh] bg-brand-white">
      <div
        className={`${scenePosition === 'before' ? 'absolute inset-x-0 top-0' : scenePosition === 'after' ? 'absolute inset-x-0 bottom-0' : 'fixed inset-x-0 top-0 z-20'} flex h-svh flex-col justify-center overflow-hidden bg-brand-white md:h-screen`}
      >
        {panel}
      </div>
    </div>
  )
}
