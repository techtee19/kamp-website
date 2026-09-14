// KAMP's About page, presenting its mission, founder, and core values.
// The founder, team and mission statement come from Sanity when present; the copy
// below is the fallback, because the dataset has no teamMember or siteSettings
// documents yet and dropping it would leave the page blank.
import Image from 'next/image'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import {
  FOUNDER_QUERY,
  SITE_SETTINGS_QUERY,
  TEAM_MEMBERS_QUERY,
  urlFor,
} from '@/sanity/lib/queries'
import type { SiteSettings, TeamMemberDocument } from '@/types/sanity'

export const revalidate = 86400 // 24 hours — about page changes rarely

// The two team queries project a subset of the document, so these name exactly the
// fields that actually come back rather than claiming the whole shape.
type FounderCard = Pick<
  TeamMemberDocument,
  '_id' | 'name' | 'role' | 'bio' | 'photo' | 'quote' | 'linkedinUrl'
>
type TeamCard = FounderCard & Pick<TeamMemberDocument, 'isFounder'>

const fallbackMission =
  'To foster a community of transformative leaders, committed to personal growth, social responsibility, and collaborative action empowering them to drive meaningful change and improve the lives of those around them.'

const values = [
  ['Build', 'We invest in character and capacity developing whole leaders, not just skills.'],
  [
    'Connect',
    'We link generations: mentors to mentees, campuses to communities, Africa to the world.',
  ],
  [
    'Inspire',
    'We tell stories, host gatherings, and model excellence that awakens vision in others.',
  ],
  ['Service', 'Our volunteers lead by serving every effort counts toward lasting change.'],
  [
    'Excellence',
    'We pursue the highest standard in everything, from mentorship planning to event production.',
  ],
  ['Community', 'No one grows alone. KAMP is a family before it is a program.'],
  [
    'Community Network',
    'A growing network of KAMP alumni who keep mentoring, hiring, and showing up for each other after the conference.',
  ],
  [
    'Leadership Development',
    "Practical training in the skills conferences don't have time to teach before, between, and after every event.",
  ],
]

export default async function AboutPage() {
  // The client is null until the Sanity env vars are set, which keeps builds green
  // before the CMS exists; treat it as "nothing published yet".
  const [founder, teamMembers, siteSettings] = client
    ? await Promise.all([
        client.fetch<FounderCard | null>(FOUNDER_QUERY),
        client.fetch<TeamCard[]>(TEAM_MEMBERS_QUERY),
        client.fetch<SiteSettings | null>(SITE_SETTINGS_QUERY),
      ])
    : [null, [], null]

  // A Sanity bio is a plain string, so blank lines are what separates paragraphs.
  const founderBio = founder?.bio
    ? founder.bio.split(/\n{2,}/).filter((paragraph) => paragraph.trim().length > 0)
    : []

  // The founder is already given his own section above, so he is not repeated here.
  const team = teamMembers.filter((member) => !member.isFounder)

  return (
    <div className="bg-brand-white text-brand-ink overflow-hidden">
      <section className="bg-brand-black relative isolate flex min-h-[450px] items-center overflow-hidden pt-16 md:min-h-[620px] md:pt-20">
        <Image
          src="/images/hero/kamp-hero1.png"
          alt="KAMP community members"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-center grayscale"
        />
        <div className="from-brand-black/55 via-brand-black/60 to-brand-black/90 absolute inset-0 -z-10 bg-gradient-to-b" />
        <h1 className="font-display text-brand-white container pb-2 text-center text-5xl font-semibold tracking-tight sm:text-6xl md:text-7xl">
          About{' '}
          <Image
            src="/images/yellow-star.png"
            alt=""
            width={80}
            height={80}
            className="mx-2 inline-block size-12 align-middle sm:mx-4 sm:size-20"
          />{' '}
          Us
        </h1>
      </section>

      <section className="relative py-16 md:py-20 xl:py-24">
        <Image
          src="/images/star.png"
          alt=""
          width={36}
          height={36}
          className="pointer-events-none absolute top-24 -right-7 z-0 size-24 md:-right-4 md:size-32"
        />
        <div className="relative z-10 container grid max-w-[1200px] gap-8 md:grid-cols-[.78fr_1.22fr] md:gap-16">
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Who we are
          </h2>
          <p className="max-w-3xl text-sm leading-relaxed md:pt-2 md:text-base">
            KAMP, the Kolade Adepoju Mentoring Program, is a non-profit organization dedicated
            to building, connecting, and inspiring transformative leaders across Africa and
            beyond.
          </p>
        </div>
      </section>

      <section className="relative py-20 md:py-24 xl:py-28">
        <Image
          src="/images/star.png"
          alt=""
          width={36}
          height={36}
          className="pointer-events-none absolute top-10 -left-8 z-0 size-24 md:-left-5 md:size-32"
        />
        <div className="relative z-10 container max-w-[1200px]">
          <div className="max-w-2xl">
            <p className="text-brand-gold text-sm font-semibold tracking-[0.18em] uppercase">
              What guides us
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Our mission and vision
            </h2>
          </div>
          <div className="mt-8 grid gap-4 md:mt-10 md:grid-cols-2 md:gap-6">
            <article className="border-brand-gold bg-brand-card rounded-xl border-l-4 p-7 md:min-h-72 md:p-9">
              <p className="text-brand-gold text-sm font-semibold tracking-[0.18em] uppercase">
                Mission
              </p>
              <p className="font-display mt-5 text-xl leading-relaxed md:text-2xl">
                {siteSettings?.missionStatement || fallbackMission}
              </p>
            </article>
            <article className="border-brand-gold bg-brand-card rounded-xl border-l-4 p-7 md:min-h-72 md:p-9">
              <p className="text-brand-gold text-sm font-semibold tracking-[0.18em] uppercase">
                Vision
              </p>
              <p className="font-display mt-5 text-xl leading-relaxed md:text-2xl">
                Raising transformative leaders that will influence their communities
                positively.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="relative pb-20 md:pb-24 xl:pb-32">
        <div className="relative z-10 container max-w-[1200px]">
          <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
            Every great leader was once mentored
          </h2>
          <p className="mt-4 max-w-6xl text-sm leading-relaxed md:text-base">
            KAMP was founded on a simple conviction: potential is everywhere, but guidance is
            not. Across Africa, brilliant young people carry big dreams yet too many walk the
            journey alone, without someone ahead of them to say, “This is the way.”
          </p>
          <p className="mt-3 max-w-6xl text-sm leading-relaxed md:text-base">
            The Kolade Adepoju Mentoring Program exists to close that gap. Through structured
            mentorship, campus chapters like KAMP LAUTECH, and gatherings like THE NEW
            Conference, we create rooms where young leaders are seen, sharpened, and sent out
            to transform their communities through mentorship conferences and community impact
            projects on Nigerian university campuses.
          </p>
          <blockquote className="border-brand-gold font-display mt-8 border-l-4 py-3 pl-3 text-base leading-relaxed font-semibold md:mt-10 md:pl-4 md:text-lg">
            “You&apos;re not just volunteering; you&apos;re making impact, inspiring others,
            and helping shape lives in your own unique way.”
          </blockquote>
          <p className="mt-8 max-w-6xl text-sm leading-relaxed md:mt-10 md:text-base">
            Today, KAMP is a growing family of mentors, mentees, volunteers, and partners
            united by one mission: raising transformative leaders who positively influence
            their communities with a bold goal of mentoring and training 10,000 youths
            annually. And we&apos;re just getting started.
          </p>
        </div>
      </section>

      <section className="relative pb-20 md:pb-28 xl:pb-36">
        <div className="container max-w-[1200px]">
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Meet the founder
          </h2>
          <div className="mt-7 grid gap-8 lg:grid-cols-[.74fr_1.26fr] lg:items-start lg:gap-10">
            <div className="bg-brand-card relative aspect-[.78/1] overflow-hidden rounded-md lg:aspect-[.8/1]">
              <Image
                src={
                  founder?.photo
                    ? urlFor(founder.photo).width(800).url()
                    : '/images/team/Founder.jpeg'
                }
                alt={founder?.name ?? 'Dr. Kolade Adepoju'}
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="lg:pt-1">
              <h3 className="font-display text-xl font-semibold md:text-2xl">
                {founder?.name ?? 'Dr. Kolade Adepoju, FIMC, CMC'}
              </h3>
              <p className="mt-1 text-sm font-semibold md:text-base">
                {founder?.role ?? 'Entrepreneur · Mentor · West Africa Youth Ambassador'}
              </p>
              <div className="mt-4 space-y-3 text-sm leading-relaxed md:text-base">
                {founderBio.length > 0 ? (
                  founderBio.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
                ) : (
                  <>
                    <p>
                      Dr. Kolade Adepoju is a versatile entrepreneur with nearly two decades of
                      experience. A Fellow of the Institute of Management Consultants (FIMC)
                      and a Certified Management Consultant (CMC), he is the MD/CEO of Riel
                      Homes, addressing housing challenges across Nigeria, Africa, and beyond.
                    </p>
                    <p>
                      His passion for mentoring led him to establish KAMP the non-profit
                      through which he pours that experience into the next generation. He is
                      happily married to Damilola Adepoju, and they are blessed with two sons,
                      David and Jason, and a daughter, Queen Esther.
                    </p>
                  </>
                )}
              </div>
              {founder?.quote && (
                <blockquote className="border-brand-gold font-display mt-6 border-l-4 py-2 pl-3 text-base leading-relaxed font-semibold">
                  “{founder.quote}”
                </blockquote>
              )}
              <Link
                href={founder?.linkedinUrl ?? '/events'}
                {...(founder?.linkedinUrl ? { target: '_blank', rel: 'noreferrer' } : {})}
                className="bg-brand-ink text-brand-white hover:bg-brand-black mt-6 inline-flex items-center gap-3 rounded-full px-5 py-2.5 text-sm transition"
              >
                {founder?.linkedinUrl ? 'Connect on LinkedIn' : 'Watch on youtube'}{' '}
                {!founder?.linkedinUrl && <span className="text-base">▶</span>}
              </Link>
            </div>
          </div>
        </div>
        <Image
          src="/images/star.png"
          alt=""
          width={36}
          height={36}
          className="pointer-events-none absolute -right-8 bottom-6 z-0 size-28 md:-right-5 md:size-36"
        />
      </section>

      {/* Only rendered once Sanity has team members. The dataset has none today, so
          this section is absent rather than showing an empty grid. */}
      {team.length > 0 && (
        <section className="pb-20 md:pb-24 xl:pb-28">
          <div className="container max-w-[1200px]">
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Meet the team
            </h2>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((member) => (
                <article key={member._id} className="bg-brand-card overflow-hidden rounded-lg">
                  <div className="relative aspect-[.85/1]">
                    <Image
                      src={urlFor(member.photo).width(600).url()}
                      alt={member.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-semibold">{member.name}</h3>
                    <p className="text-brand-gold mt-1 text-xs font-semibold tracking-[0.12em] uppercase">
                      {member.role}
                    </p>
                    <p className="text-brand-ink/90 mt-3 text-sm leading-relaxed">
                      {member.bio}
                    </p>
                    {member.linkedinUrl && (
                      <a
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand-ink/70 hover:text-brand-gold mt-4 inline-block text-xs font-semibold transition"
                      >
                        LinkedIn →
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="pb-16 md:pb-20">
        <div className="container max-w-[1200px]">
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            What we stand on
          </h2>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(([title, description]) => (
              <article
                key={title}
                className="border-brand-gold bg-brand-card min-h-44 rounded-lg border-l-2 p-5 md:min-h-48"
              >
                <h3 className="font-display text-lg font-semibold">{title}</h3>
                <p className="text-brand-ink/90 mt-4 text-sm leading-relaxed">{description}</p>
              </article>
            ))}
          </div>
          <div className="mt-14 text-center md:mt-16">
            <h2 className="font-display text-xl font-semibold md:text-2xl">
              Ready to grow with us?
            </h2>
            <Link
              href="/get-involved"
              className="bg-brand-ink text-brand-white hover:bg-brand-black mt-4 inline-flex rounded-full px-6 py-2.5 text-sm transition"
            >
              Join Kamp
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
