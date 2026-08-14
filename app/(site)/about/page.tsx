// KAMP's About page, presenting its mission, founder, and core values.
import Image from 'next/image'
import Link from 'next/link'

const values = [
  ['Build', 'We invest in character and capacity — developing whole leaders, not just skills.'],
  ['Connect', 'We link generations: mentors to mentees, campuses to communities, Africa to the world.'],
  ['Inspire', 'We tell stories, host gatherings, and model excellence that awakens vision in others.'],
  ['Service', 'Our volunteers lead by serving — every effort counts toward lasting change.'],
  ['Excellence', 'We pursue the highest standard in everything, from mentorship planning to event production.'],
  ['Community', 'No one grows alone. KAMP is a family before it is a program.'],
  ['Community Network', 'A growing network of KAMP alumni who keep mentoring, hiring, and showing up for each other after the conference.'],
  ['Leadership Development', "Practical training in the skills conferences don't have time to teach — before, between, and after every event."],
]

export default function AboutPage() {
  return (
    <div className="overflow-hidden bg-brand-white text-brand-ink">
      <section className="relative isolate flex min-h-[410px] items-center overflow-hidden bg-brand-black pt-16 md:min-h-[520px]">
        <Image src="/images/hero/kamp-hero1.png" alt="KAMP community members" fill priority sizes="100vw" className="-z-20 object-cover object-center grayscale" />
        <div className="absolute inset-0 -z-10 bg-brand-black/70" />
        <h1 className="container pb-4 text-center font-display text-5xl font-semibold tracking-tight text-brand-white sm:text-7xl lg:text-8xl">
          About <Image src="/images/yellow-star.png" alt="" width={80} height={80} className="mx-2 inline-block size-12 align-middle sm:mx-4 sm:size-20" /> Us
        </h1>
      </section>

      <section className="relative py-16 md:py-20 xl:py-24">
        <Image src="/images/star.png" alt="" width={36} height={36} className="pointer-events-none absolute -right-7 top-24 size-24 md:-right-4 md:size-32" />
        <div className="container grid max-w-[1200px] gap-8 md:grid-cols-[.78fr_1.22fr] md:gap-16">
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">Who we are</h2>
          <p className="max-w-3xl text-sm leading-relaxed md:pt-2 md:text-base">KAMP — the Kolade Adepoju Mentoring Program — is a non-profit organization dedicated to building, connecting, and inspiring transformative leaders across Africa and beyond.</p>
        </div>
      </section>

      <section className="relative pb-20 md:pb-24 xl:pb-32">
        <div className="container max-w-[1200px]">
          <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">Every great leader was once mentored</h2>
          <p className="mt-4 max-w-6xl text-sm leading-relaxed md:text-base">KAMP was founded on a simple conviction: potential is everywhere, but guidance is not. Across Africa, brilliant young people carry big dreams — yet too many walk the journey alone, without someone ahead of them to say, “This is the way.”</p>
          <p className="mt-3 max-w-6xl text-sm leading-relaxed md:text-base">The Kolade Adepoju Mentoring Program exists to close that gap. Through structured mentorship, campus chapters like KAMP LAUTECH, and gatherings like THE NEW Conference, we create rooms where young leaders are seen, sharpened, and sent out to transform their communities — through mentorship conferences and community impact projects on Nigerian university campuses.</p>
          <blockquote className="mt-8 border-l-4 border-brand-gold py-3 pl-3 font-display text-base font-semibold leading-relaxed md:mt-10 md:pl-4 md:text-lg">“You're not just volunteering; you're making impact, inspiring others, and helping shape lives in your own unique way.”</blockquote>
          <p className="mt-8 max-w-6xl text-sm leading-relaxed md:mt-10 md:text-base">Today, KAMP is a growing family of mentors, mentees, volunteers, and partners united by one mission: raising transformative leaders who positively influence their communities — with a bold goal of mentoring and training 10,000 youths annually. And we're just getting started.</p>
        </div>
      </section>

      <section className="relative pb-20 md:pb-28 xl:pb-36">
        <div className="container max-w-[1200px]">
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">Meet the founder</h2>
          <div className="mt-7 grid gap-8 lg:grid-cols-[.74fr_1.26fr] lg:items-start lg:gap-10">
            <div className="relative aspect-[.78/1] overflow-hidden rounded-md bg-brand-card lg:aspect-[.8/1]">
              <Image src="/images/team/Founder.jpeg" alt="Dr. Kolade Adepoju" fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
            </div>
            <div className="lg:pt-1">
              <h3 className="font-display text-xl font-semibold md:text-2xl">Dr. Kolade Adepoju, FIMC, CMC</h3>
              <p className="mt-1 text-sm font-semibold md:text-base">Entrepreneur · Mentor · West Africa Youth Ambassador</p>
              <div className="mt-4 space-y-3 text-sm leading-relaxed md:text-base">
                <p>Dr. Kolade Adepoju is a versatile entrepreneur with nearly two decades of experience. A Fellow of the Institute of Management Consultants (FIMC) and a Certified Management Consultant (CMC), he is the MD/CEO of H&amp;L Homes, addressing housing challenges across Nigeria, Africa, and beyond.</p>
                <p>His passion for mentoring led him to establish KAMP — the non-profit through which he pours that experience into the next generation. He is happily married to Damilola Adepoju, and they are blessed with two sons, David and Jason, and a daughter, Queen Esther.</p>
              </div>
              <Link href="/events" className="mt-6 inline-flex items-center gap-3 rounded-full bg-brand-ink px-5 py-2.5 text-sm text-brand-white transition hover:bg-brand-black">Watch on youtube <span className="text-base">▶</span></Link>
            </div>
          </div>
        </div>
        <Image src="/images/star.png" alt="" width={36} height={36} className="pointer-events-none absolute -right-8 bottom-6 size-28 md:-right-5 md:size-36" />
      </section>

      <section className="pb-16 md:pb-20">
        <div className="container max-w-[1200px]">
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">What we stand on</h2>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(([title, description]) => (
              <article key={title} className="min-h-44 rounded-lg border-l-2 border-brand-gold bg-brand-card p-5 md:min-h-48">
                <h3 className="font-display text-lg font-semibold">{title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-brand-ink/90">{description}</p>
              </article>
            ))}
          </div>
          <div className="mt-14 text-center md:mt-16">
            <h2 className="font-display text-xl font-semibold md:text-2xl">Ready to grow with us?</h2>
            <Link href="/get-involved" className="mt-4 inline-flex rounded-full bg-brand-ink px-6 py-2.5 text-sm text-brand-white transition hover:bg-brand-black">Join Kamp</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
