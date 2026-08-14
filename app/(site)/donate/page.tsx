// KAMP's donation page with a secure, Nigerian-payment-ready checkout.
import Image from 'next/image'
import { HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react'
import DonateForm from '@/components/donate/DonateForm'

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
          <div className="flex gap-4"><ShieldCheck className="mt-1 size-6 shrink-0 text-brand-gold" strokeWidth={1.7} /><div><h3 className="font-semibold">Secure and transparent</h3><p className="mt-1 text-sm leading-relaxed text-brand-grey">Cards, bank transfer, and USSD are securely handled through our payment partner.</p></div></div>
        </div></aside>
        <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">Make a donation</p><h2 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">Choose how you&apos;d like to give.</h2><p className="mt-3 text-sm leading-relaxed text-brand-grey">You can make a one-time contribution or become a monthly supporter.</p><div className="mt-7"><DonateForm /></div></div>
      </div></section>
    </div>
  )
}
