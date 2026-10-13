// KAMP's four pathways for students, institutions, mentors, and sponsors.
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Building2, GraduationCap, HandHeart, Handshake } from 'lucide-react'

const pathways = [
  {
    title: 'Students',
    eyebrow: 'Find your people',
    description: "You don't have to figure it out alone. KAMP connects Nigerian university students with mentors, peers, and programs designed to sharpen your leadership and clarify your direction.",
    action: 'Apply to KAMP',
    href: '/events',
    icon: GraduationCap,
  },
  {
    title: 'Universities',
    eyebrow: 'Bring KAMP to campus',
    description: 'Your students are ready to lead. Partner with KAMP to host mentorship conferences and meaningful development experiences directly on your campus.',
    action: 'Host KAMP',
    href: '/contact',
    icon: Building2,
  },
  {
    title: 'Volunteers & Mentors',
    eyebrow: 'Show up for the next generation',
    description: 'Bring your experience, honest conversations, and practical wisdom to students who need someone to walk alongside them as they grow.',
    action: 'Become a mentor',
    href: '/contact',
    icon: HandHeart,
  },
  {
    title: 'Sponsors',
    eyebrow: 'Create lasting impact',
    description: 'Fund programs, sponsor events, or support campus projects that place your organisation at the centre of leadership that outlasts a campaign.',
    action: 'Partner with us',
    href: '/contact',
    icon: Handshake,
  },
]

export default function GetInvolvedPage() {
  return (
    <main className="overflow-hidden bg-brand-white text-brand-ink">
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container grid max-w-[1200px] items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div className="py-3">
            <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.19em] text-brand-ink/60 sm:text-sm"><span aria-hidden="true" className="h-px w-8 bg-brand-gold" />Get involved</p>
            <h1 className="mt-5 max-w-2xl font-display text-[clamp(2.8rem,6vw,4.75rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-brand-black">There&apos;s a place for you in the work.</h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-brand-grey sm:text-lg">Whether you&apos;re looking for direction, ready to give back, or want to invest in Africa&apos;s next generation, KAMP gives you a meaningful way to show up.</p>
            <Link href="#pathways" className="group mt-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-brand-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-ink active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100">Explore your path <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" /></Link>
          </div>
          <figure className="relative isolate aspect-[1.18] min-h-72 overflow-hidden rounded-[28px] bg-brand-card shadow-[0_20px_60px_rgba(32,32,32,0.12)] sm:aspect-[1.3] lg:aspect-[1.12]">
            <Image src="/images/hero/kamp-hero1.png" alt="KAMP community members gathered at a program" fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover object-center" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-brand-black/65 via-transparent to-transparent" />
            <figcaption className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 rounded-2xl border border-white/20 bg-brand-black/45 p-4 text-white shadow-lg backdrop-blur-md sm:inset-x-5 sm:bottom-5 sm:p-5">
              <div><p className="text-[10px] font-bold uppercase tracking-[0.17em] text-brand-gold">Together, we move forward</p><p className="mt-1 text-sm font-medium sm:text-base">A community shaped by people who show up.</p></div>
            </figcaption>
          </figure>
        </div>
      </section>

      <section id="pathways" className="relative isolate scroll-mt-24 overflow-hidden border-y border-brand-card bg-brand-cream/60 py-16 sm:py-20 lg:py-24">
        <Image aria-hidden="true" src="/images/star.png" alt="" width={80} height={80} className="pointer-events-none absolute right-[-1.25rem] top-20 z-0 size-20 opacity-90 sm:right-2 sm:top-16 sm:size-24" />
        <div className="container relative z-10 max-w-[1200px]">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-ink/60">Choose your path</p><h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-[-0.035em] md:text-4xl">Grow with KAMP in the way that fits you.</h2></div>
            <p className="max-w-sm text-sm leading-relaxed text-brand-grey">Start where you are. There are meaningful ways to learn, lead, and support the next generation.</p>
          </div>
          <div className="mt-8 grid gap-4 sm:mt-10 md:grid-cols-2">
            {pathways.map(({ title, eyebrow, description, action, href, icon: Icon }, index) => (
              <article key={title} className={`group flex min-h-[300px] flex-col overflow-hidden rounded-2xl border bg-white p-6 shadow-[0_1px_2px_rgba(32,32,32,0.03)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(32,32,32,0.08)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:min-h-[320px] sm:p-8 ${index === 0 ? 'border-brand-gold/60' : 'border-brand-card'}`}>
                <div className="flex items-center justify-between gap-4">
                  <span className={`grid size-12 place-items-center rounded-2xl ${index === 0 ? 'bg-brand-gold text-brand-black' : 'bg-brand-cream text-brand-ink'}`}><Icon aria-hidden="true" className="size-5" strokeWidth={1.8} /></span>
                  <span className="font-mono text-xs tracking-wide text-brand-grey/65">0{index + 1} / 04</span>
                </div>
                <p className="mt-7 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-ink/55">{eyebrow}</p>
                <h3 className="mt-2 font-display text-2xl font-semibold tracking-[-0.025em] text-brand-black sm:text-3xl">{title}</h3>
                <p className="mt-3 max-w-lg flex-1 text-sm leading-relaxed text-brand-grey">{description}</p>
                <Link href={href} className="group/link mt-6 inline-flex min-h-11 w-fit items-center gap-2 border-b border-brand-gold/50 pb-1 text-sm font-semibold text-brand-ink transition-colors hover:border-brand-ink hover:text-brand-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-ink active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100">{action}<ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover/link:translate-x-1 motion-reduce:transition-none" /></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-black py-16 text-white sm:py-20">
        <div className="container flex max-w-[1200px] flex-col items-start justify-between gap-7 md:flex-row md:items-center">
          <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">Your next step</p><h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">Not sure where to begin?</h2><p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">Tell us what you&apos;re looking for and we&apos;ll help you find the right way in.</p></div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link href="/contact" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white/50 hover:bg-white/[0.06] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100">Talk to KAMP</Link>
            <Link href="/membership" className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-gold px-6 py-3 text-sm font-semibold text-brand-black transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100">Become a member <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" /></Link>
          </div>
        </div>
      </section>
    </main>
  )
}
