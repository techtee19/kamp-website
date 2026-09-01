// Landing page for Paystack's post-payment redirect. The donation's real status is
// settled by /api/paystack/webhook, not by arriving here, so this page confirms the
// hand-off and shows the reference rather than asserting anything the webhook owns.
import { ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import DonationReference from './DonationReference'

export default function DonateSuccessPage() {
  return (
    <div className="overflow-hidden bg-brand-white text-brand-ink">
      <section className="py-28 md:py-36">
        <div className="container max-w-[1200px]">
          <div className="max-w-2xl rounded-2xl border-l-4 border-brand-gold bg-brand-card p-8 md:p-10">
            <ShieldCheck className="size-10 text-brand-gold" strokeWidth={1.7} />
            <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight md:text-5xl">
              Thank you for your donation!
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-brand-grey md:text-base">
              Your payment was successful. A receipt has been sent to your email.
            </p>

            {/* useSearchParams needs a boundary — without one the prerender has no
                place to fall back to and the build fails on this route. */}
            <Suspense fallback={null}>
              <DonationReference />
            </Suspense>

            <Link
              href="/"
              className="mt-8 inline-flex rounded-full bg-brand-ink px-6 py-3 text-sm text-brand-white transition hover:bg-brand-black"
            >
              Return to KAMP
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
