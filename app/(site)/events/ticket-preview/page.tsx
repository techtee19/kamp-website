import { ArrowLeft, ArrowUpRight, Download } from 'lucide-react'
import Link from 'next/link'
import { PREVIEW_TICKET_REF } from '@/lib/ticket-preview'

export default function TicketPreviewPage() {
  return (
    <main className="min-h-[80vh] bg-brand-cream pb-16 pt-28 text-brand-ink sm:pt-32">
      <div className="container max-w-[1200px]">
        <Link href="/events" className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-brand-grey transition-colors hover:text-brand-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold">
          <ArrowLeft aria-hidden="true" className="size-4" /> Back to events
        </Link>
        <header className="mt-8 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">A look before you register</p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-[-0.04em] text-brand-black sm:text-5xl">Your KAMP event ticket</h1>
            <p className="mt-4 text-sm leading-relaxed text-brand-grey sm:text-base">This sample shows the one-page PDF ticket registrants receive by email, including its scannable QR code and unique ticket reference. The attendee and event details are for preview only.</p>
          </div>
          <a href="/api/ticket-preview" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-ink px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold active:scale-[0.98] motion-reduce:transition-none">
            Open or download PDF <Download aria-hidden="true" className="size-4" /><ArrowUpRight aria-hidden="true" className="size-4" />
          </a>
        </header>

        <section aria-label="Sample ticket PDF" className="mt-8 overflow-hidden rounded-2xl border border-brand-ink/10 bg-white shadow-[0_18px_50px_rgba(23,35,59,0.08)]">
          <iframe title="KAMP event ticket sample PDF" src="/api/ticket-preview" className="h-[70vh] min-h-[420px] w-full" />
        </section>
        <p className="mt-4 text-center text-xs text-brand-grey">Preview code {PREVIEW_TICKET_REF} is not valid for event entry.</p>
      </div>
    </main>
  )
}
