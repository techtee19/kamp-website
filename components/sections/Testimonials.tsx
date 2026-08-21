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
  {
    name: 'Stephen Oladejo',
    role: 'lead photographer at KAMP Global',
    image: '/images/testimonials/steveman.jpeg',
    quote:
      'I’m Stephen Oladejo, lead photographer at KAMP Global, and working with KAMP has completely expanded my mindset on what impact truly means. Traveling to different campuses across Nigeria to host conferences and enlighten students has been a game changer for me.Being under the mentorship of Dr. Kolade Adepoju while documenting these powerful moments through my lens and shooting with top-tier gadgets has elevated my craft in ways I could not have imagined.',
  },
  {
    name: 'Ololade Oluwafunmbi',
    role: 'TEAM LEAD, Editorial Team UNILAG',
    image: '/images/testimonials/omolade.jpeg',
    quote:
      'Being in KAMP has opened my eyes to so many different things and made me go out I’ve learned the importance of mentorship, the value of showing up for people even during difficult times, and the power of creativity especially at the most unexpected moments. Being part of the editorial team has challenged me to think differently, express ideas creatively, and work with others to bring those ideas to life.It is fun because I am being challenged.',
  },
  {
    name: 'Abiola Simbiat Itunuoluwa',
    role: 'Campus lead, KAMP Funaab',
    image: '/images/testimonials/simbiat.jpeg',
    quote:
      'Being part of the Kolade Adepoju Mentoring Program has been more than just being part of a club, it has felt like finding family. It is a space that promotes togetherness, encourages self discovery and teaches you to embrace your uniqueness without prejudice.Since joining, I have gained valuable insight, mentorship, and a deeper understanding of myself. I still remember attending one of the program’s events in 2025 and leaving with a feeling I had never quite experienced before,I knew I had finally found where I fit.The Kolade Adepoju Mentoring Program has reminded me that sometimes, finding your people is also finding a part of yourself. I am genuinely grateful to be part of this family',
  },
  {
    name: 'Josh Matiluko',
    role: 'KAMP media director',
    image: '/images/testimonials/josh.jpeg',
    quote:
      'My journey with KAMP began with a re-examination of self, followed by a redefinition of purpose.  Since I joined KAMP’s meetings, the community and mentorship here have consistently challenged my old mindset and strengthened my vision I’m grateful for that growth',
  },
  {
    name: 'KAMP Volunteer',
    role: 'Community volunteer',
    image: '/images/gallery/visit-gallery-5.png',
    quote:
      'Showing up for students through KAMP is a practical way to help shape leaders who are ready to serve where they are needed most.',
  },
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
      <Image
        src="/images/star.png"
        alt=""
        width={36}
        height={36}
        className="pointer-events-none absolute top-6 -right-10 z-0 size-28 md:top-10 md:-right-8"
      />
      <div className="relative z-10 container flex min-h-0 w-full max-w-[800px] flex-1 flex-col py-6 md:block md:flex-none md:py-0 xl:max-w-[1200px]">
        <h2 className="font-display text-brand-ink shrink-0 text-[26px] leading-tight font-semibold md:text-2xl xl:text-3xl">
          Here&apos;s what people think of KAMP
        </h2>
        <div className="mt-5 flex min-h-0 flex-1 flex-col gap-4 md:grid md:grid-cols-[168px_1fr] md:items-center md:gap-6 xl:mt-8 xl:grid-cols-[280px_1fr] xl:gap-10">
          <div className="flex min-h-0 flex-1 flex-col gap-1.5 md:grid md:flex-none">
            {testimonials.map((testimonial, index) => (
              <button
                key={testimonial.name}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`relative min-h-0 basis-0 overflow-hidden rounded-lg text-left transition-[height,flex-grow,opacity] duration-300 ease-out md:grow-0 md:basis-auto ${index === activeIndex ? 'grow-4 md:h-32 xl:h-52' : 'grow opacity-80 hover:opacity-100 md:h-6 xl:h-10'}`}
                aria-label={`Show testimonial from ${testimonial.name}`}
                aria-pressed={index === activeIndex}
              >
                <Image
                  src={testimonial.image}
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 280px, (min-width: 768px) 168px"
                  className="object-cover grayscale"
                />
                <span className="bg-brand-black/55 absolute inset-0" />
              </button>
            ))}
          </div>

          <article className="bg-brand-card shrink-0 rounded-xl p-3 md:p-5 xl:p-8">
            {/* TODO: replace placeholder quotes with verified KAMP testimonials. */}
            {/* The mobile floor under the quote keeps every card the same height,
                so the strips above hold still while the scene advances. */}
            <blockquote
              key={active.name}
              className="text-brand-deep min-h-30 text-[13px] leading-[20px] motion-safe:animate-[fade-in_400ms_ease-out] md:min-h-0 md:text-xs md:leading-[1.35] xl:text-sm xl:leading-relaxed"
            >
              {active.quote}
            </blockquote>
            <div className="mt-5 flex items-end justify-between gap-4 xl:mt-8">
              <div>
                <p className="font-display text-brand-ink text-[17px] font-semibold md:text-xl xl:text-2xl">
                  {active.name}
                </p>
                <p className="text-brand-grey mt-1 max-w-[120px] text-xs md:max-w-none md:text-[10px] xl:text-xs">
                  {active.role}
                </p>
              </div>
              <Link
                href="/get-involved"
                className="bg-brand-ink text-brand-white shrink-0 rounded-full px-5 py-2 text-xs md:px-4 md:py-1.5 md:text-[10px] xl:px-6 xl:py-2.5 xl:text-xs"
              >
                Join KAMP
              </Link>
            </div>
          </article>
        </div>
      </div>
    </>
  )

  return (
    /* The runway gives each testimonial roughly the same slice of scroll as a
       "Take action" tab, plus a closing screen for the panel to leave on. */
    <div ref={scrollSectionRef} className="bg-brand-white relative h-[425vh]">
      <div
        className={`${scenePosition === 'before' ? 'absolute inset-x-0 top-0' : scenePosition === 'after' ? 'absolute inset-x-0 bottom-0' : 'fixed inset-x-0 top-0 z-20'} bg-brand-white flex h-svh flex-col justify-center overflow-hidden md:h-screen`}
      >
        {panel}
      </div>
    </div>
  )
}
