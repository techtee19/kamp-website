import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowDownToLine, ArrowLeft, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Membership Card Preview | KAMP',
  description: 'Preview a sample KAMP membership card before applying.',
}

export default function MembershipCardPreviewPage() {
  return (
    <main className="min-h-screen bg-[#F5F3EE] px-5 pb-16 pt-28 text-brand-ink sm:pt-32">
      <div className="mx-auto max-w-5xl">
        <Link href="/membership#apply" className="inline-flex items-center gap-2 text-sm font-medium text-brand-grey transition hover:text-brand-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-ink">
          <ArrowLeft aria-hidden="true" className="size-4" /> Back to membership
        </Link>
        <div className="mt-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-ink/60">A first look</p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">Your KAMP membership card</h1>
            <p className="mt-4 max-w-xl leading-relaxed text-brand-grey">A sample of the card members receive by email after joining. The name and member ID below are fictional preview details.</p>
          </div>
          <a href="/api/membership/card-preview?download=1" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-brand-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-black focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brand-ink active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100">
            <ArrowDownToLine aria-hidden="true" className="size-4" /> Download sample PDF
          </a>
        </div>

        <div className="mt-8 grid items-center justify-items-center gap-8 overflow-hidden rounded-2xl border border-brand-ink/10 bg-white px-5 py-8 shadow-[0_24px_70px_rgba(23,35,59,0.12)] sm:px-10 sm:py-12 lg:grid-cols-[minmax(260px,340px)_1fr] lg:justify-items-start lg:gap-14 lg:px-16">
          <article aria-label="Sample KAMP professional membership card" className="flex aspect-[153/243] w-full max-w-[340px] flex-col overflow-hidden rounded-[22px] border border-[#D9D4C9] bg-[#FFFEFC] shadow-[0_20px_48px_rgba(23,35,59,0.2)]">
            <div className="flex h-[25%] shrink-0 items-center justify-between bg-[#17233B] px-[8%]">
              <Image src="/kamp_logo.png" alt="KAMP" width={180} height={80} className="h-[58%] w-[36%] object-contain" />
              <div className="max-w-[58%] text-right">
                <p className="text-[clamp(8px,2.2vw,12px)] font-bold tracking-[0.16em] text-[#F2BD2E]">MEMBER CARD</p>
                <p className="mt-1 text-[clamp(6px,1.6vw,9px)] leading-snug tracking-wide text-white">KOLADE ADEPOJU<br />MENTORING PROGRAM</p>
              </div>
            </div>
            <div className="h-[1%] shrink-0 bg-[#F2BD2E]" />
            <div className="flex min-h-0 flex-1 flex-col items-center px-[9%] pb-[4%] pt-[4%] text-center">
              <div className="grid aspect-[0.86] w-[31%] shrink-0 place-items-center rounded-xl border-2 border-[#D6B343] bg-[#EAE7DF] text-3xl font-bold tracking-wider text-[#17233B]">AO</div>
              <h2 className="mt-[3%] max-w-full shrink-0 truncate text-[clamp(15px,4.2vw,23px)] font-bold tracking-tight text-[#17233B]">Ada Okafor</h2>
              <span className="mt-[1%] shrink-0 rounded-full bg-[#F7F0D9] px-3 py-1 text-[clamp(8px,2vw,11px)] font-bold tracking-[0.12em] text-[#705615]">PROFESSIONAL</span>
              <p className="mt-[1.5%] line-clamp-2 shrink-0 text-[clamp(9px,2.3vw,13px)] leading-snug text-[#626B79]">Software Engineer</p>
              <div className="mt-[1.5%] w-full shrink-0 rounded-lg bg-[#F7F0D9] px-[6%] py-[1.5%] text-left">
                <p className="text-[clamp(7px,1.7vw,10px)] font-bold tracking-[0.12em] text-[#705615]">KAMP POSITION</p>
                <p className="mt-1 truncate text-[clamp(9px,2.3vw,13px)] font-bold text-[#17233B]">Campus Lead</p>
              </div>
              <div className="mt-auto w-full shrink-0 rounded-lg border border-[#E5E0D5] bg-[#F3F1EB] px-[6%] py-[1.5%] text-left">
                <p className="text-[clamp(7px,1.7vw,10px)] font-bold tracking-[0.16em] text-[#7A7468]">MEMBER ID</p>
                <p className="mt-1 truncate font-mono text-[clamp(10px,2.8vw,15px)] font-bold text-[#17233B]">KAMP/PRO/2026/00042</p>
              </div>
            </div>
            <div className="flex h-[10%] shrink-0 items-center justify-between bg-[#17233B] px-[8%]">
              <p className="text-[clamp(6px,1.5vw,9px)] tracking-wide text-white">MENTORSHIP · COMMUNITY · GROWTH</p>
              <p className="text-[clamp(8px,2vw,11px)] font-bold text-[#F2BD2E]">2026</p>
            </div>
          </article>

          <div className="max-w-md">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-ink/60">Front of card</p>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-[-0.03em]">One clear, personal member identity.</h2>
            <p className="mt-3 leading-relaxed text-brand-grey">The portrait and name lead, while the membership category and ID stay easy to find. KAMP navy and gold frame the card without crowding the details.</p>
            <p className="mt-5 text-sm font-medium text-brand-ink">Sample: Ada Okafor · Professional</p>
          </div>
        </div>
        <p className="mt-5 flex items-start gap-2 text-sm leading-relaxed text-brand-grey">
          <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-ink/70" />
          This preview uses fictional sample details. Your card will use your name, membership category, member ID, and submitted passport photo.
        </p>
      </div>
    </main>
  )
}
