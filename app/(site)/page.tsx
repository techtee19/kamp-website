// KAMP landing page assembling the campaign's stories, actions, and community proof.
import { Building2, Compass, Hammer, UsersRound } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import GalleryMarquee from '@/components/sections/GalleryMarquee'
import GetInvolvedTabs from '@/components/sections/GetInvolvedTabs'
import HeroImageRotator from '@/components/sections/HeroImageRotator'
import QuickStory from '@/components/sections/QuickStory'
import StatCounter from '@/components/sections/StatCounter'
import Testimonials from '@/components/sections/Testimonials'

const stats = [
  ['5+', 'Universities Reached'],
  ['10,000+', 'Students Mentored'],
  ['20+', 'Campus impact projects delivered'],
  ['5+', 'Years running'],
]

const actions = [
  {
    icon: Compass,
    title: 'Mentorship Conferences',
    copy: "Multi-day gatherings where students learn directly from leaders who've walked the path ahead of them.",
  },
  {
    icon: Hammer,
    title: 'Campus Impact Projects',
    copy: 'Real infrastructure and community projects, built with students, on the campuses that need them.',
  },
  {
    icon: UsersRound,
    title: 'Community Network',
    copy: 'A growing network of KAMP alumni who keep mentoring, hiring, and showing up for each other after the conference.',
  },
  {
    icon: Building2,
    title: 'Leadership Development',
    copy: "Practical training in the skills conferences don't have time to teach before, between, and after every event.",
  },
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
      <section className="bg-brand-black relative isolate h-[100svh] min-h-[100svh] overflow-hidden md:h-[100dvh] md:min-h-[100dvh]">
        <HeroImageRotator />
        <div className="bg-brand-black/45 absolute inset-0 -z-10" />
        {/* Mobile star sits high in the empty space above the headline and is
            clipped by the right edge; lg has its own star beside the video. */}
        <Image
          src="/images/star.png"
          alt=""
          width={96}
          height={96}
          className="pointer-events-none absolute top-[18svh] -right-8 z-0 size-24 lg:hidden"
        />
        <div className="container flex h-full flex-col justify-end gap-10 pt-24 pb-13 lg:grid lg:grid-cols-[1fr_.9fr] lg:items-end lg:gap-12 lg:pt-28 lg:pb-12">
          <div className="text-brand-white max-w-xl">
            <h1 className="font-display text-[40px] leading-[1.1] font-semibold tracking-tight sm:text-6xl sm:leading-[.88] lg:text-7xl">
              <span className="block">Build.</span>
              <span className="text-brand-gold block">Connect.</span>
              <span className="block">Inspire.</span>
            </h1>
            <p className="text-brand-white/85 mt-6 max-w-lg text-[15px] leading-relaxed sm:mt-7 sm:text-lg">
              KAMP mentors students across Nigerian universities through conferences, community
              projects, and hands-on leadership training turning potential into transformation,
              one campus at a time.
            </p>
          </div>
          <div className="relative isolate mx-auto w-full max-w-lg lg:justify-self-end">
            <Image
              src="/images/star.png"
              alt=""
              width={36}
              height={36}
              className="absolute -top-6 -left-6 z-0 hidden size-14 lg:block"
            />
            <div className="border-brand-white relative z-10 aspect-[1.87/1] overflow-hidden rounded-xl border-[3px] lg:aspect-[1.75/1] lg:rounded-3xl lg:border-4">
              <Image
                src="/images/hero/kamp-hero2.png"
                alt="KAMP conference speaker addressing students"
                fill
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover"
              />
              <span className="bg-brand-black/20 absolute inset-0 grid place-items-center">
                <span className="border-brand-white/70 bg-brand-white/25 text-brand-white grid size-12 place-items-center rounded-full border backdrop-blur-sm lg:size-16">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="ml-0.5 size-5 fill-current lg:size-6"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-gold py-12 lg:py-14">
        <div className="container grid grid-cols-2 gap-y-9 text-center md:grid-cols-4">
          {stats.map(([value, label]) => (
            <div key={label}>
              <p className="font-display text-brand-black text-4xl leading-none">
                <StatCounter value={value} />
              </p>
              <p className="text-brand-black/80 mt-2 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <QuickStory />

      <section className="py-20 lg:py-24">
        <div className="relative z-10 container">
          <Image
            src="/images/star.png"
            alt=""
            width={36}
            height={36}
            className="absolute top-3 right-0 z-0 size-9 lg:right-14"
          />
          <h2 className="font-display text-brand-ink relative z-10 max-w-3xl text-[26px] leading-tight font-semibold sm:text-4xl">
            Take action and grow with KAMP
          </h2>
          <p className="text-brand-black/80 relative z-10 mt-4 max-w-3xl text-[15px] leading-relaxed sm:text-base">
            Whether you&apos;re a student looking for direction, a professional ready to give
            back, or a partner who believes in Africa&apos;s next generation there&apos;s a
            place for you here.
          </p>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {actions.map(({ title, copy }, index) => (
              <article
                key={title}
                className="bg-brand-card flex min-h-60 flex-col rounded-lg p-5"
              >
                <Image
                  src={`/images/action/action_${index + 1}.png`}
                  alt=""
                  width={48}
                  height={48}
                  className="size-10 object-contain"
                />
                <h3 className="font-display text-brand-ink mt-auto pt-7 text-[17px] leading-tight font-semibold lg:text-base">
                  {title}
                </h3>
                <p className="text-brand-ink/85 mt-4 max-w-[230px] text-[15px] leading-[1.28] sm:max-w-none sm:text-sm sm:leading-[1.35]">
                  {copy}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <GalleryMarquee />

      {/* GetInvolvedTabs carries its own heading at every breakpoint. */}
      <GetInvolvedTabs />

      <section className="bg-brand-white py-14 lg:py-16 xl:py-32">
        <div className="container grid max-w-[760px] items-center gap-8 md:grid-cols-[306px_1fr] md:gap-10 xl:max-w-[1200px] xl:grid-cols-[575px_1fr] xl:gap-20">
          <div className="relative mx-auto h-[211px] w-[306px] xl:h-[400px] xl:w-[575px]">
            <div className="absolute bottom-0 left-0 h-[187px] w-[132px] overflow-hidden rounded xl:h-[353px] xl:w-[248px]">
              <Image
                src="/images/programs-section-1.png"
                alt="Student participating in a KAMP program"
                fill
                sizes="(min-width: 1280px) 248px, 132px"
                className="object-cover"
              />
            </div>
            <div className="absolute top-0 right-0 h-[211px] w-[167px] overflow-hidden rounded xl:h-[400px] xl:w-[313px]">
              <Image
                src="/images/programs-section-2.png"
                alt="KAMP participant sharing at an event"
                fill
                sizes="(min-width: 1280px) 313px, 167px"
                className="object-cover"
              />
            </div>
          </div>
          <div className="text-brand-ink max-w-[350px] md:max-w-[350px] xl:max-w-[545px]">
            <p className="text-[15px] leading-[1.35] md:text-xs xl:text-lg xl:leading-[1.45]">
              KAMP started with a question: what happens if someone invests in Nigeria&apos;s
              student leaders before the world tells them who they&apos;re supposed to become?
              Since 2022, that question has turned into conferences, campus projects, and a
              growing community of students who are done waiting for permission to lead.
            </p>
            <p className="mt-7 text-[15px] leading-[1.35] md:mt-12 md:text-xs xl:mt-20 xl:text-lg xl:leading-[1.45]">
              Get mentored, get connected, get moving on the leadership path you&apos;re
              already on.
            </p>
            <Link
              href="/programs"
              className="bg-brand-ink text-brand-white hover:bg-brand-deep mt-5 inline-block rounded-full px-6 py-2.5 text-sm transition md:mt-3 md:px-5 md:py-2 md:text-xs xl:mt-5 xl:px-8 xl:py-3 xl:text-base"
            >
              View programs
            </Link>
          </div>
        </div>
      </section>

      <Testimonials />

      <section className="bg-brand-white py-10 lg:py-9">
        <div className="container flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-center lg:gap-9">
          <p className="font-display text-brand-ink text-2xl font-semibold lg:text-3xl">
            Partnered with:
          </p>
          <div className="grid grid-cols-2 items-center gap-x-4 gap-y-5 lg:flex lg:flex-nowrap lg:gap-x-6 lg:gap-y-4">
            {partners.map((partner, index) => (
              <Image
                key={partner}
                src={partner}
                alt={`KAMP partner ${index + 1}`}
                width={156}
                height={40}
                className="h-7 w-auto object-contain opacity-90 grayscale lg:h-9 lg:opacity-70"
              />
            ))}
          </div>
          {/* TODO: add actual partner logo files as the partner list expands. */}
        </div>
      </section>
    </div>
  )
}
