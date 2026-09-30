import type { Metadata } from 'next'
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
  return <div className="overflow-hidden bg-brand-white text-brand-ink">
    <section className="bg-brand-ink px-5 pb-16 pt-32 text-white sm:pb-20 sm:pt-40"><div className="container max-w-[1120px]"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">KAMP Membership</p><h1 className="mt-4 max-w-3xl font-display text-5xl font-semibold tracking-tight sm:text-6xl">A community to help you become who you&apos;re meant to be.</h1><p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">Join a community of students and young leaders growing through mentorship, connection, and meaningful opportunities.</p><Link href="#apply" className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-gold px-6 py-3 text-sm font-semibold text-brand-black">Become a member <ArrowRight className="size-4" /></Link></div></section>
    <section className="container max-w-[1120px] py-16 sm:py-20"><h2 className="font-display text-3xl font-semibold sm:text-4xl">Membership is a place to grow.</h2><div className="mt-8 grid gap-5 md:grid-cols-3">{benefits.map(({ icon: Icon, title, copy }) => <article key={title} className="rounded-2xl bg-brand-card p-6"><Icon className="size-8 text-brand-gold" /><h3 className="mt-5 font-display text-xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-brand-grey">{copy}</p></article>)}</div></section>
    <section id="apply" className="bg-[#F5F0E8] py-16 sm:py-20"><div className="container grid max-w-[1120px] gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">Your next step</p><h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">Join the KAMP community.</h2><p className="mt-4 leading-relaxed text-brand-grey">Complete the form and we&apos;ll create your membership. Your member ID and card will be sent to your email.</p></div><div className="rounded-2xl bg-white p-5 shadow-sm sm:p-8"><MembershipForm /></div></div></section>
  </div>
}
