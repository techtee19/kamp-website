// KAMP's donation page. Online giving is not live yet — the client has not signed
// off on a payment provider — so the form is replaced with a coming-soon panel.
// DonateForm, AmountSelector, /api/donate, the Paystack webhook and /donate/success
// are all still in the tree; re-rendering <DonateForm /> below turns giving back on.
import Image from 'next/image'
import Link from 'next/link'
import { Clock, HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react'

export default function DonatePage() {
  return (
    <div className="overflow-hidden bg-brand-white text-brand-ink">
      <section className="relative border-b border-brand-ink/10 py-20 md:py-28 xl:py-32">
        <Image src="/images/star.png" alt="" width={36} height={36} className="pointer-events-none absolute -right-7 top-16 z-0 size-28 md:-right-4 md:size-36" />
        <div className="container relative z-10 max-w-[1200px]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">Invest in the next generation</p>
          <h1 className="mt-3 max-w-4xl font-display text-5xl font-semibold tracking-tight text-brand-black sm:text-6xl md:text-7xl">Your generosity gives student leaders room to grow.</h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-brand-grey md:text-lg">Every gift helps KAMP create transformative mentorship experiences, campus projects, and communities where young Nigerians can lead with confidence.</p>
        </div>
      </section>

      <section className="py-16 md:py-20 xl:py-24"><div className="container grid max-w-[1200px] gap-12 lg:grid-cols-[.78fr_1.22fr] lg:gap-20">
        <aside className="lg:pt-5"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">Give with confidence</p><h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">Small gifts make lasting impact.</h2><div className="mt-8 space-y-6">
          <div className="flex gap-4"><HeartHandshake className="mt-1 size-6 shrink-0 text-brand-gold" strokeWidth={1.7} /><div><h3 className="font-semibold">Where your gift goes</h3><p className="mt-1 text-sm leading-relaxed text-brand-grey">Mentor sessions, student resources, conferences, and practical campus impact projects.</p></div></div>
          <div className="flex gap-4"><Sparkles className="mt-1 size-6 shrink-0 text-brand-gold" strokeWidth={1.7} /><div><h3 className="font-semibold">A community-powered future</h3><p className="mt-1 text-sm leading-relaxed text-brand-grey">Your support helps students turn clarity into meaningful action where they are.</p></div></div>
          <div className="flex gap-4"><ShieldCheck className="mt-1 size-6 shrink-0 text-brand-gold" strokeWidth={1.7} /><div><h3 className="font-semibold">Secure and transparent</h3><p className="mt-1 text-sm leading-relaxed text-brand-grey">Cards, bank transfer, and USSD will be securely handled through our payment partner.</p></div></div>
        </div></aside>
        <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">Make a donation</p><h2 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">Online giving is coming soon.</h2><p className="mt-3 text-sm leading-relaxed text-brand-grey">We&apos;re putting the final pieces of our payment setup in place. Until then, our team can take your gift directly.</p>
          <div className="mt-7 rounded-xl border-l-4 border-brand-gold bg-brand-card p-7 md:p-9">
            <Clock className="size-9 text-brand-gold" strokeWidth={1.6} />
            <p className="mt-5 font-display text-2xl font-semibold">Coming soon</p>
            <p className="mt-3 text-sm leading-relaxed text-brand-grey">Card, bank transfer, and USSD donations will be available on this page shortly. If you&apos;d like to support KAMP today, send us a message and we&apos;ll walk you through it.</p>
            <Link href="/contact" className="mt-6 inline-flex rounded-full bg-brand-ink px-6 py-3 text-sm text-brand-white transition hover:bg-brand-black">Contact us to give</Link>
          </div>
        </div>
      </div></section>
    </div>
  )
}
