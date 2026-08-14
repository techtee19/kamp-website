// KAMP landing page assembling the campaign's stories, actions, and community proof.
import { Building2, Compass, Hammer, UsersRound } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import GalleryMarquee from '@/components/sections/GalleryMarquee'
import GetInvolvedTabs from '@/components/sections/GetInvolvedTabs'
import HeroImageRotator from '@/components/sections/HeroImageRotator'
import StatCounter from '@/components/sections/StatCounter'
import Testimonials from '@/components/sections/Testimonials'

const stats = [
  ['20+', 'Universities Reached'],
  ['10,000+', 'Students Mentored'],
  ['20+', 'Campus impact projects delivered'],
  ['5+', 'Years running'],
]

const actions = [
  { icon: Compass, title: 'Mentorship Conferences', copy: "Multi-day gatherings where students learn directly from leaders who've walked the path ahead of them." },
  { icon: Hammer, title: 'Campus Impact Projects', copy: 'Real infrastructure and community projects, built with students, on the campuses that need them.' },
  { icon: UsersRound, title: 'Community Network', copy: 'A growing network of KAMP alumni who keep mentoring, hiring, and showing up for each other after the conference.' },
  { icon: Building2, title: 'Leadership Development', copy: "Practical training in the skills conferences don't have time to teach — before, between, and after every event." },
]

const partners = [
  '/images/partners/partner-1.png',
  '/images/partners/partner-2.png',
  '/images/partners/partner-3.png',
  '/images/partners/partner-4.png',
  '/images/partners/partner-5.png',
]

export default function HomePage() {
  return (
    <div className="bg-brand-white text-brand-black">

      <section className="relative isolate aspect-[1280/665] min-h-[480px] overflow-hidden bg-brand-black lg:min-h-0">
        <HeroImageRotator />
        <div className="absolute inset-0 -z-10 bg-brand-black/45" />
        <div className="container grid h-full items-end gap-12 pb-10 pt-24 lg:grid-cols-[1fr_.9fr] lg:pb-12 lg:pt-28">
          <div className="max-w-xl text-brand-white">
            <h1 className="font-display text-5xl font-semibold leading-[.88] tracking-tight sm:text-6xl lg:text-7xl">
              <span className="block">Build.</span>
              <span className="block text-brand-gold">Connect.</span>
              <span className="block">Inspire.</span>
            </h1>
            <p className="mt-7 max-w-lg text-base leading-relaxed text-brand-white/85 sm:text-lg">KAMP mentors students across Nigerian universities through conferences, community projects, and hands-on leadership training — turning potential into transformation, one campus at a time.</p>
          </div>
          <div className="relative isolate mx-auto w-full max-w-lg lg:justify-self-end">
            <Image src="/images/star.png" alt="" width={36} height={36} className="absolute -left-6 -top-6 z-0 size-14" />
            <div className="relative z-10 aspect-[1.75/1] overflow-hidden rounded-3xl border-4 border-brand-white">
              <Image src="/images/hero/kamp-hero2.png" alt="KAMP conference speaker addressing students" fill sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover" />
              <span className="absolute inset-0 grid place-items-center bg-brand-black/20"><span className="grid size-16 place-items-center rounded-full border border-brand-white bg-brand-black/35 pl-1 text-2xl text-brand-white">▶</span></span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-gold py-12 lg:py-14">
        <div className="container grid grid-cols-2 gap-y-9 text-center md:grid-cols-4">
          {stats.map(([value, label]) => (
            <div key={label}>
              <p className="font-display text-4xl leading-none text-brand-black"><StatCounter value={value} /></p>
              <p className="mt-2 text-sm text-brand-black/80">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-brand-gold py-16 lg:py-20">
        <div className="container grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:gap-16">
          <h2 className="font-display text-5xl leading-none text-brand-black sm:text-6xl">Quick Story</h2>
          <p className="max-w-3xl text-base leading-relaxed text-brand-black/85 sm:text-lg">KAMP started with a question: what happens if someone invests in Nigeria&apos;s student leaders before the world tells them who they&apos;re supposed to become? Since 2018, that question has turned into conferences, campus projects, and a growing community of students who are done waiting for permission to lead.</p>
        </div>
      </section>

      <section className="py-20 lg:py-24">
        <div className="container relative">
          <Image src="/images/star.png" alt="" width={36} height={36} className="absolute right-14 top-3 size-9" />
          <h2 className="max-w-3xl font-display text-3xl font-semibold leading-tight text-brand-ink sm:text-4xl">Take action and grow with KAMP</h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-brand-black/80 sm:text-base">Whether you&apos;re a student looking for direction, a professional ready to give back, or a partner who believes in Africa&apos;s next generation — there&apos;s a place for you here.</p>
          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {actions.map(({ title, copy }, index) => (
              <article key={title} className="flex min-h-60 flex-col rounded-lg bg-brand-card p-5">
                <Image src={`/images/action/action_${index + 1}.png`} alt="" width={48} height={48} className="size-10 object-contain" />
                <h3 className="mt-auto pt-7 font-display text-base font-semibold leading-tight text-brand-ink">{title}</h3>
                <p className="mt-4 text-sm leading-[1.35] text-brand-ink/85">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <GalleryMarquee />

      <section className="bg-brand-white">
        <div>
          <div className="hidden">
          <h2 className="max-w-3xl font-display text-[26px] font-semibold leading-tight text-brand-ink">Take action and grow with KAMP</h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-brand-black/80 sm:text-base">Whether you&apos;re a student looking for direction, a professional ready to give back, or a partner who believes in Africa&apos;s next generation — there&apos;s a place for you here.</p>
          </div>
          <GetInvolvedTabs />
        </div>
      </section>

      <section className="bg-brand-white py-16 xl:py-32">
        <div className="container grid max-w-[760px] items-center gap-10 md:grid-cols-[306px_1fr] md:gap-10 xl:max-w-[1200px] xl:grid-cols-[575px_1fr] xl:gap-20">
          <div className="relative mx-auto h-[211px] w-[306px] xl:h-[400px] xl:w-[575px]">
            <div className="absolute bottom-0 left-0 h-[187px] w-[132px] overflow-hidden rounded xl:h-[353px] xl:w-[248px]"><Image src="/images/programs-section-1.png" alt="Student participating in a KAMP program" fill sizes="(min-width: 1280px) 248px, 132px" className="object-cover" /></div>
            <div className="absolute right-0 top-0 h-[211px] w-[167px] overflow-hidden rounded xl:h-[400px] xl:w-[313px]"><Image src="/images/programs-section-2.png" alt="KAMP participant sharing at an event" fill sizes="(min-width: 1280px) 313px, 167px" className="object-cover" /></div>
          </div>
          <div className="max-w-[350px] text-brand-ink xl:max-w-[545px]">
            <p className="text-xs leading-[1.45] xl:text-lg xl:leading-[1.45]">KAMP started with a question: what happens if someone invests in Nigeria&apos;s student leaders before the world tells them who they&apos;re supposed to become? Since 2018, that question has turned into conferences, campus projects, and a growing community of students who are done waiting for permission to lead.</p>
            <p className="mt-12 text-xs leading-[1.45] xl:mt-20 xl:text-lg xl:leading-[1.45]">Get mentored, get connected, get moving on the leadership path you&apos;re already on.</p>
            <Link href="/programs" className="mt-3 inline-block rounded-full bg-brand-ink px-5 py-2 text-xs text-brand-white transition hover:bg-brand-deep xl:mt-5 xl:px-8 xl:py-3 xl:text-base">View programs</Link>
          </div>
        </div>
      </section>

      <Testimonials />

      <section className="bg-brand-white py-8 lg:py-9">
        <div className="container flex flex-col items-center justify-center gap-5 lg:flex-row lg:gap-9">
          <p className="font-display text-3xl font-semibold text-brand-ink">Partnered with:</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 lg:flex-nowrap">
            {partners.map((partner, index) => <Image key={partner} src={partner} alt={`KAMP partner ${index + 1}`} width={156} height={40} className="h-9 w-auto object-contain opacity-70 grayscale" />)}
          </div>
          {/* TODO: add actual partner logo files as the partner list expands. */}
        </div>
      </section>

    </div>
  )
}
