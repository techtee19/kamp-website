// KAMP's filterable listing of upcoming and past events.
import Image from 'next/image'
import EventListing from '@/components/events/EventListing'
import { kampEvents } from '@/lib/event-data'

export default function EventsPage() {
  return (
    <div className="overflow-hidden bg-brand-white text-brand-ink">
      <section className="relative border-b border-brand-ink/10 py-20 md:py-28 xl:py-32">
        <Image src="/images/star.png" alt="" width={36} height={36} className="pointer-events-none absolute -right-7 top-16 size-28 md:-right-4 md:size-36" />
        <div className="container max-w-[1200px]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">Make an impact</p>
          <h1 className="mt-3 max-w-3xl font-display text-5xl font-semibold tracking-tight text-brand-black sm:text-6xl md:text-7xl">Find your next KAMP experience.</h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-brand-grey md:text-lg">Meet mentors, challenge your thinking, and build alongside students who are ready to lead their campuses and communities.</p>
        </div>
      </section>

      <section className="py-16 md:py-20 xl:py-24">
        <div className="container max-w-[1200px]">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">What&apos;s happening</p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">Events for every stage of your journey</h2>
            </div>
            <p className="text-sm text-brand-grey">{kampEvents.length} KAMP experiences and counting</p>
          </div>
          <div className="mt-8 md:mt-10"><EventListing events={kampEvents} /></div>
        </div>
      </section>
    </div>
  )
}
