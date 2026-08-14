// KAMP's contact page with enquiry form and direct community channels.
import Image from 'next/image'
import { AtSign, Mail, MapPin, Share2 } from 'lucide-react'
import ContactForm from '@/components/contact/ContactForm'

export default function ContactPage() {
  return (
    <div className="overflow-hidden bg-brand-white text-brand-ink">
      <section className="relative border-b border-brand-ink/10 py-20 md:py-28 xl:py-32">
        <Image src="/images/star.png" alt="" width={36} height={36} className="pointer-events-none absolute -right-7 top-16 z-0 size-28 md:-right-4 md:size-36" />
        <div className="container relative z-10 max-w-[1200px]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">Contact KAMP</p>
          <h1 className="mt-3 max-w-3xl font-display text-5xl font-semibold tracking-tight text-brand-black sm:text-6xl md:text-7xl">Let&apos;s start a conversation that moves things forward.</h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-brand-grey md:text-lg">Have a question, want to bring KAMP to your campus, or ready to partner with us? We&apos;d love to hear from you.</p>
        </div>
      </section>

      <section className="py-16 md:py-20 xl:py-24"><div className="container grid max-w-[1200px] gap-12 lg:grid-cols-[.78fr_1.22fr] lg:gap-20"><aside className="lg:pt-4"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">Reach us directly</p><h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">We&apos;re here to help you find your way in.</h2><div className="mt-8 space-y-6"><div className="flex gap-4"><Mail className="mt-1 size-6 shrink-0 text-brand-gold" strokeWidth={1.7} /><div><p className="font-semibold">Email</p><a href="mailto:info@wearekamp.org" className="mt-1 inline-block text-sm text-brand-grey transition hover:text-brand-ink">info@wearekamp.org</a></div></div><div className="flex gap-4"><MapPin className="mt-1 size-6 shrink-0 text-brand-gold" strokeWidth={1.7} /><div><p className="font-semibold">Where we work</p><p className="mt-1 text-sm leading-relaxed text-brand-grey">Across Nigerian campuses and communities.</p></div></div></div><div className="mt-10 border-t border-brand-ink/15 pt-7"><p className="text-sm font-semibold">Follow KAMP</p><div className="mt-4 flex gap-3"><a href="https://www.instagram.com/wearekamp" target="_blank" rel="noreferrer" className="grid size-11 place-items-center rounded-full border border-brand-ink/20 text-brand-ink transition hover:border-brand-gold hover:text-brand-gold" aria-label="Follow KAMP on Instagram"><AtSign className="size-5" /></a><a href="https://www.linkedin.com/company/kolade-adepoju-mentoring-program" target="_blank" rel="noreferrer" className="grid size-11 place-items-center rounded-full border border-brand-ink/20 text-brand-ink transition hover:border-brand-gold hover:text-brand-gold" aria-label="Follow KAMP on LinkedIn"><Share2 className="size-5" /></a></div></div></aside><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">Send a message</p><h2 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">How can we help?</h2><p className="mt-3 text-sm leading-relaxed text-brand-grey">Share the details and our team will get back to you as soon as possible.</p><div className="mt-7"><ContactForm /></div></div></div></section>

      <section className="bg-brand-gold py-14 md:py-16"><div className="container flex max-w-[1200px] flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><p className="font-display text-3xl font-semibold text-brand-black md:text-4xl">KAMP is closer than you think.</p><p className="mt-2 text-sm text-brand-black/75 md:text-base">Follow our community for event updates, campus stories, and new ways to get involved.</p></div><a href="https://www.instagram.com/wearekamp" target="_blank" rel="noreferrer" className="inline-flex w-fit rounded-full bg-brand-ink px-6 py-3 text-sm font-semibold text-brand-white transition hover:bg-brand-black">Follow @wearekamp</a></div></section>
    </div>
  )
}
