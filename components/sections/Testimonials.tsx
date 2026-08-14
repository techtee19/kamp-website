'use client'

// Clickable testimonial cards and active testimonial detail.
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
    <section className="relative overflow-hidden bg-brand-white py-20 lg:py-28">
      <div className="container relative">
        <span className="pointer-events-none absolute -right-6 top-36 hidden font-display text-[13rem] leading-none text-brand-teal lg:block">*</span>
        <h2 className="max-w-2xl font-display text-4xl font-semibold leading-tight text-brand-black sm:text-5xl">Here&apos;s what people think of KAMP</h2>
        <div className="mt-12 grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-center lg:gap-12">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {testimonials.map((testimonial, index) => (
              <button key={testimonial.name} type="button" onClick={() => setActiveIndex(index)} className={`relative min-h-12 overflow-hidden rounded-lg text-left transition lg:min-h-14 ${index === activeIndex ? 'ring-2 ring-brand-gold' : 'opacity-80 hover:opacity-100'} ${index === 2 ? 'lg:min-h-32' : ''}`} aria-pressed={index === activeIndex}>
                <Image src={testimonial.image} alt="" fill sizes="(min-width: 1024px) 320px, 33vw" className="object-cover" />
                <span className="absolute inset-0 bg-brand-black/70" />
                <span className="relative flex h-full min-h-12 items-center gap-3 px-4 py-2 text-brand-white lg:min-h-14">
                  <Image src={testimonial.image} alt="" width={30} height={30} className="size-8 rounded-full border border-brand-white object-cover" />
                  <span className="font-display text-sm font-semibold">{testimonial.name}</span>
                </span>
              </button>
            ))}
          </div>
          <article className="max-w-2xl rounded-xl bg-brand-card p-7 sm:p-10">
            {/* TODO: replace placeholder quotes with verified KAMP testimonials. */}
            <blockquote className="text-sm leading-relaxed text-brand-black sm:text-base">{active.quote}</blockquote>
            <blockquote className="mt-5 text-sm leading-relaxed text-brand-black/80 sm:text-base">{active.quote}</blockquote>
            <p className="mt-8 font-display text-2xl font-bold text-brand-black">{active.name}</p>
            <p className="mt-1 text-sm text-brand-grey">{active.role}</p>
            <Link href="/get-involved" className="mt-7 inline-block rounded-full bg-brand-black px-6 py-2.5 text-sm text-brand-white">Join KAMP</Link>
          </article>
        </div>
      </div>
    </section>
  )
}
