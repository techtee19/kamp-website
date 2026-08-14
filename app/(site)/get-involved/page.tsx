// KAMP's four pathways for students, institutions, mentors, and sponsors.
import Image from 'next/image'
import Link from 'next/link'
import { Building2, GraduationCap, HandHeart, Handshake } from 'lucide-react'

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
    <div className="overflow-hidden bg-brand-white text-brand-ink">
      <section className="relative border-b border-brand-ink/10 py-20 md:py-28 xl:py-32">
        <Image src="/images/star.png" alt="" width={36} height={36} className="pointer-events-none absolute -right-7 top-16 z-0 size-28 md:-right-4 md:size-36" />
        <div className="container relative z-10 max-w-[1200px]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">Get involved</p>
          <h1 className="mt-3 max-w-4xl font-display text-5xl font-semibold tracking-tight text-brand-black sm:text-6xl md:text-7xl">There&apos;s a place for you in the work.</h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-brand-grey md:text-lg">Whether you&apos;re looking for direction, ready to give back, or want to invest in Africa&apos;s next generation, KAMP gives you a meaningful way to show up.</p>
        </div>
      </section>

      <section className="py-16 md:py-20 xl:py-24">
        <div className="container max-w-[1200px]">
          <div className="max-w-2xl"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">Choose your path</p><h2 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">Grow with KAMP in the way that fits you.</h2></div>
          <div className="mt-8 grid gap-5 md:mt-10 md:grid-cols-2">
            {pathways.map(({ title, eyebrow, description, action, href, icon: Icon }, index) => (
              <article key={title} className={`group relative overflow-hidden rounded-2xl p-7 md:min-h-[300px] md:p-9 ${index === 0 ? 'bg-brand-gold text-brand-black' : 'bg-brand-card'}`}>
                <Icon className={`size-9 ${index === 0 ? 'text-brand-black' : 'text-brand-gold'}`} strokeWidth={1.5} />
                <p className={`mt-7 text-sm font-semibold uppercase tracking-[0.16em] ${index === 0 ? 'text-brand-black/65' : 'text-brand-gold'}`}>{eyebrow}</p>
                <h3 className="mt-2 font-display text-3xl font-semibold tracking-tight">{title}</h3>
                <p className={`mt-4 max-w-md text-sm leading-relaxed ${index === 0 ? 'text-brand-black/75' : 'text-brand-grey'}`}>{description}</p>
                <Link href={href} className={`mt-7 inline-flex rounded-full px-5 py-2.5 text-sm font-semibold transition ${index === 0 ? 'bg-brand-ink text-brand-white hover:bg-brand-black' : 'bg-brand-ink text-brand-white hover:bg-brand-black'}`}>{action}</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-gold py-14 md:py-16"><div className="container flex max-w-[1200px] flex-col gap-6 md:flex-row md:items-center md:justify-between"><div><p className="font-display text-3xl font-semibold text-brand-black md:text-4xl">Not sure where to begin?</p><p className="mt-2 text-sm text-brand-black/75 md:text-base">Tell us what you&apos;re looking for and we&apos;ll help you find the right way in.</p></div><Link href="/contact" className="w-fit rounded-full bg-brand-ink px-6 py-3 text-sm font-semibold text-brand-white transition hover:bg-brand-black">Talk to KAMP</Link></div></section>
    </div>
  )
}
