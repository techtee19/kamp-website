// KAMP's programs, impact pillars, and leadership structure.
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Building2, GraduationCap, HandHeart } from 'lucide-react'

const focusAreas = [
  ['Leadership Development', 'Cultivating visionary leaders with strong moral values and decision-making capacity.'],
  ['Entrepreneurship & Business Growth', 'Equipping young entrepreneurs and business-minded individuals with tools to succeed.'],
  ['Holistic Growth', 'Supporting personal, professional, and spiritual development.'],
  ['Educational Empowerment', 'Inspiring students through school outreaches and campus activations.'],
  ['Community Impact', 'Implementing CSR projects that address societal needs in line with global development priorities.'],
]

const executiveRoles = [
  ['Chief Executive Officer', 'Overall executive decision maker, oversees the CEC and team KPIs.'],
  ['Program/Operations Director', 'Oversees strategic direction and execution.'],
  ['Partnerships & Sponsorship Director', 'Engages with donors, organizations, and grant providers.'],
  ['Volunteers Director', 'Manages volunteer recruitment, training, and retention.'],
  ['Media/Communications Director', 'Oversees branding, PR, and digital strategy.'],
  ['Finance & Administration Director', 'Manages budgeting and compliance.'],
]

const journey = [
  ['01', 'Apply', 'Tell us where you are and what you want to grow into.'],
  ['02', 'Attend', 'Learn from mentors, meet your peers, and step into the room.'],
  ['03', 'Transform', 'Put your learning into action on campus and in your community.'],
]

export default function ProgramsPage() {
  return (
    <div className="overflow-hidden bg-brand-white text-brand-ink">
      <section className="relative border-b border-brand-ink/10 py-20 md:py-28 xl:py-32">
        <Image src="/images/star.png" alt="" width={36} height={36} className="pointer-events-none absolute -right-7 top-16 z-0 size-28 md:-right-4 md:size-36" />
        <div className="container relative z-10 max-w-[1200px]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">KAMP programs</p>
          <h1 className="mt-3 max-w-4xl font-display text-5xl font-semibold tracking-tight text-brand-black sm:text-6xl md:text-7xl">Practical spaces for leaders to become who they&apos;re meant to be.</h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-brand-grey md:text-lg">KAMP turns potential into purpose through mentorship conferences, campus action, and a community that keeps showing up.</p>
        </div>
      </section>

      <section className="py-16 md:py-20 xl:py-24"><div className="container max-w-[1200px]"><div className="max-w-2xl"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">What we build</p><h2 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">Programs built for action, not just inspiration.</h2></div>
        <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-2"><article className="grid overflow-hidden rounded-2xl bg-brand-card md:grid-cols-[.9fr_1.1fr]"><div className="relative min-h-64"><Image src="/images/programs-section-1.png" alt="KAMP mentorship conference" fill sizes="(min-width: 1024px) 25vw, 100vw" className="object-cover" /></div><div className="p-7 md:p-8"><GraduationCap className="size-7 text-brand-gold" strokeWidth={1.6} /><h3 className="mt-5 font-display text-2xl font-semibold">Mentorship Conferences</h3><p className="mt-3 text-sm leading-relaxed text-brand-grey">Multi-day gatherings where students learn directly from leaders who have walked the path ahead. Every session is designed to build clarity, confidence, and meaningful connections.</p></div></article>
          <article className="grid overflow-hidden rounded-2xl bg-brand-card md:grid-cols-[.9fr_1.1fr]"><div className="relative min-h-64"><Image src="/images/programs-section-2.png" alt="KAMP community impact project" fill sizes="(min-width: 1024px) 25vw, 100vw" className="object-cover" /></div><div className="p-7 md:p-8"><Building2 className="size-7 text-brand-gold" strokeWidth={1.6} /><h3 className="mt-5 font-display text-2xl font-semibold">Campus Impact Projects</h3><p className="mt-3 text-sm leading-relaxed text-brand-grey">Real infrastructure and community projects, built with students on campuses that need them. We give leaders a chance to see the impact of their ideas in the real world.</p></div></article></div>
      </div></section>

      <section className="bg-brand-gold py-16 md:py-20 xl:py-24"><div className="container max-w-[1200px]"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-black/70">Your KAMP journey</p><h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-brand-black md:text-4xl">How it works</h2><div className="mt-10 grid gap-8 md:grid-cols-3 md:gap-0">{journey.map(([number, title, copy], index) => <article key={title} className={`px-0 md:px-8 ${index > 0 ? 'md:border-l md:border-brand-black/20' : ''}`}><p className="font-display text-5xl text-brand-black/35">{number}</p><h3 className="mt-4 font-display text-2xl font-semibold text-brand-black">{title}</h3><p className="mt-3 max-w-xs text-sm leading-relaxed text-brand-black/75">{copy}</p></article>)}</div><Link href="/get-involved" className="mt-10 inline-flex items-center gap-2 rounded-full bg-brand-ink px-6 py-3 text-sm text-brand-white">Start your journey <ArrowRight className="size-4" /></Link></div></section>

      <section className="relative py-16 md:py-20 xl:py-24"><Image src="/images/star.png" alt="" width={36} height={36} className="pointer-events-none absolute -left-8 top-12 z-0 size-24 md:-left-5 md:size-32" /><div className="container relative z-10 max-w-[1200px]"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">Core focus areas</p><h2 className="mt-2 max-w-2xl font-display text-3xl font-semibold tracking-tight md:text-4xl">Our work is anchored on these pillars.</h2><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{focusAreas.map(([title, copy]) => <article key={title} className="rounded-xl border-l-4 border-brand-gold bg-brand-card p-6"><h3 className="font-display text-xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-brand-grey">{copy}</p></article>)}</div></div></section>

      <section className="pb-16 md:pb-20 xl:pb-24"><div className="container max-w-[1200px]"><div className="grid gap-8 border-t border-brand-ink/15 pt-12 lg:grid-cols-[.8fr_1.2fr]"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">The people behind the work</p><h2 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">Core Executive Committee</h2><p className="mt-4 text-sm leading-relaxed text-brand-grey">Our CEC are the decision makers and strategic leaders responsible for moving the KAMP mission forward.</p><HandHeart className="mt-7 size-9 text-brand-gold" strokeWidth={1.5} /></div><div className="grid gap-3 sm:grid-cols-2">{executiveRoles.map(([role, copy]) => <article key={role} className="rounded-xl bg-brand-card p-5"><h3 className="font-display text-lg font-semibold">{role}</h3><p className="mt-2 text-sm leading-relaxed text-brand-grey">{copy}</p></article>)}</div></div></div></section>
    </div>
  )
}
