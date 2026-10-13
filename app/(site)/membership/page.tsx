import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Compass, Handshake, Sparkles } from 'lucide-react'
import MembershipForm from '@/components/membership/MembershipForm'

export const metadata: Metadata = {
  title: 'KAMP Membership | Join a community built for growth',
  description: 'Become a KAMP member and connect with mentors, peers, and opportunities that support your growth and leadership.',
}

const benefits = [
  { icon: Compass, title: 'Guidance that moves you forward', copy: 'Learn alongside mentors and peers who help you find clarity and take your next step.' },
  { icon: Handshake, title: 'A community in your corner', copy: 'Build meaningful relationships with young people who are growing with purpose.' },
  { icon: Sparkles, title: 'Room to grow and contribute', copy: 'Discover programs, experiences, and ways to put your gifts to work.' },
]

export default function MembershipPage() {
  return <main className="overflow-hidden bg-brand-white text-brand-ink">
    <section className="relative isolate flex min-h-[min(720px,90svh)] items-center overflow-hidden px-5 pb-16 pt-32 text-white sm:pb-20 sm:pt-36">
      <Image src="/images/membership.jpg" alt="" fill priority sizes="100vw" className="-z-20 object-cover object-center" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-black/85 via-brand-black/65 to-brand-black/30" />
      <div className="container relative z-10 max-w-[1120px]">
        <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-brand-gold sm:text-sm"><span aria-hidden="true" className="h-px w-8 bg-brand-gold" />KAMP Membership</p>
        <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.8rem,6.5vw,5rem)] font-semibold leading-[0.98] tracking-[-0.045em]">A community to help you become who you&apos;re meant to be.</h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">Join students, professionals, and community members growing through mentorship, connection, and meaningful opportunities.</p>
        <Link href="#apply" className="group mt-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-brand-gold px-6 py-3 text-sm font-semibold text-brand-black transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100">Become a member <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" /></Link>
      </div>
    </section>
    <section className="container max-w-[1120px] py-16 sm:py-20 lg:py-24">
      <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-ink/60">More than a membership</p><h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl">A place to learn, connect, and contribute.</h2></div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {benefits.map(({ icon: Icon, title, copy }, index) => <article key={title} className="group rounded-2xl border border-brand-card bg-white p-6 shadow-[0_1px_2px_rgba(32,32,32,0.03)] transition duration-200 hover:-translate-y-0.5 hover:border-brand-ink/20 hover:shadow-[0_12px_32px_rgba(32,32,32,0.07)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-7"><div className="flex items-center justify-between"><span className="grid size-11 place-items-center rounded-xl bg-brand-cream text-brand-ink"><Icon aria-hidden="true" className="size-5" strokeWidth={1.8} /></span><span className="font-mono text-xs text-brand-grey/70">0{index + 1}</span></div><h3 className="mt-7 font-display text-xl font-semibold leading-snug tracking-[-0.02em]">{title}</h3><p className="mt-3 text-sm leading-relaxed text-brand-grey">{copy}</p></article>)}
      </div>
    </section>
    <section id="apply" className="scroll-mt-20 border-t border-brand-card bg-[#F5F0E8] py-16 sm:py-20 lg:py-24">
      <div className="container grid max-w-[1120px] items-start gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
        <div className="lg:sticky lg:top-28">
          <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-ink/60"><span aria-hidden="true" className="h-px w-7 bg-brand-gold" />Your next step</p>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-[1.05] tracking-[-0.035em] sm:text-4xl">Find your place in the KAMP community.</h2>
          <p className="mt-5 max-w-md leading-relaxed text-brand-grey">Tell us a little about yourself. We&apos;ll create your membership and send your member ID and card to your email.</p>
          <Link href="/membership/card-preview" className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-ink underline decoration-brand-gold decoration-2 underline-offset-4 transition-colors hover:text-brand-grey focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-ink">
            Preview the membership card <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
          </Link>
          <p className="mt-6 max-w-md border-l-2 border-brand-gold pl-4 text-sm leading-relaxed text-brand-grey">Your details are used to manage your membership and keep you connected with KAMP.</p>
        </div>
        <div className="rounded-[24px] border border-white/80 bg-white p-5 shadow-[0_20px_60px_rgba(32,32,32,0.07)] sm:p-8 lg:p-9">
          <MembershipForm />
        </div>
      </div>
    </section>
  </main>
}
