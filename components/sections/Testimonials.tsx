'use client'

// Compact selectable testimonials with a cropped background star detail.
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const testimonials = [
  { name: 'Poopola Deborah', role: 'Computer scientist, content creator', image: '/images/gallery/visit-gallery-1.png', quote: 'KAMP started with a question: what happens if someone invests in Nigeria’s student leaders before the world tells them who they’re supposed to become? Since 2018, that question has turned into conferences, campus projects, and a growing community of students who are done waiting for permission to lead.' },
  { name: 'KAMP Alumnus', role: 'Student leader', image: '/images/gallery/visit-gallery-2.png', quote: 'KAMP gave me the confidence to speak up, build with others, and take responsibility for the change I wanted to see on campus.' },
  { name: 'KAMP Mentor', role: 'Volunteer mentor', image: '/images/gallery/visit-gallery-3.png', quote: 'The conversations at KAMP are honest and practical. You meet students who are ready to translate ambition into service and meaningful action.' },
  { name: 'Campus Partner', role: 'University partner', image: '/images/gallery/visit-gallery-4.png', quote: 'Seeing our students return from KAMP with clearer goals and a deeper commitment to their community is the kind of impact every campus needs.' },
  { name: 'KAMP Volunteer', role: 'Community volunteer', image: '/images/gallery/visit-gallery-5.png', quote: 'Showing up for students through KAMP is a practical way to help shape leaders who are ready to serve where they are needed most.' },
]

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = testimonials[activeIndex]

  return (
    <section className="relative overflow-hidden bg-brand-white py-16 lg:py-20 xl:py-24">
      <Image src="/images/star.png" alt="" width={36} height={36} className="pointer-events-none absolute -right-10 top-6 z-0 size-28 md:-right-8 md:top-10" />
      <div className="container relative z-10 max-w-[800px] xl:max-w-[1200px]">
        <h2 className="font-display text-2xl font-semibold leading-tight text-brand-ink xl:text-3xl">Here&apos;s what people think of KAMP</h2>
        <div className="mt-5 grid gap-6 md:grid-cols-[168px_1fr] md:items-center md:gap-6 xl:mt-8 xl:grid-cols-[280px_1fr] xl:gap-10">
          <div className="grid gap-1.5">
            {testimonials.map((testimonial, index) => (
              <button key={testimonial.name} type="button" onClick={() => setActiveIndex(index)} className={`relative overflow-hidden rounded-lg text-left transition ${index === 2 ? 'h-32 border-2 border-brand-gold xl:h-52' : 'h-6 xl:h-10'} ${index === activeIndex ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`} aria-label={`Show testimonial from ${testimonial.name}`} aria-pressed={index === activeIndex}>
                <Image src={testimonial.image} alt="" fill sizes="168px" className="object-cover" />
                <span className="absolute inset-0 bg-brand-black/55" />
              </button>
            ))}
          </div>

          <article className="rounded-xl bg-brand-card p-5 xl:p-8">
            {/* TODO: replace placeholder quotes with verified KAMP testimonials. */}
            <blockquote className="text-xs leading-[1.35] text-brand-deep xl:text-sm xl:leading-relaxed">{active.quote}</blockquote>
            <blockquote className="mt-4 text-xs leading-[1.35] text-brand-deep/80 xl:mt-6 xl:text-sm xl:leading-relaxed">{active.quote}</blockquote>
            <div className="mt-5 flex items-end justify-between gap-4 xl:mt-8">
              <div>
                <p className="font-display text-xl font-semibold text-brand-ink xl:text-2xl">{active.name}</p>
                <p className="mt-1 text-[10px] text-brand-grey xl:text-xs">{active.role}</p>
              </div>
              <Link href="/get-involved" className="shrink-0 rounded-full bg-brand-ink px-4 py-1.5 text-[10px] text-brand-white xl:px-6 xl:py-2.5 xl:text-xs">Join KAMP</Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
