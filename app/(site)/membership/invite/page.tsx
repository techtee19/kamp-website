import type { Metadata } from 'next'
import Link from 'next/link'
import LeadershipInviteRegistration from '@/components/membership/LeadershipInviteRegistration'

export const metadata: Metadata = {
  title: 'Leadership Registration | KAMP',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default function LeadershipInvitationPage() {
  return <main className="min-h-screen bg-brand-cream px-4 py-12 text-brand-ink sm:px-6 sm:py-16">
    <div className="mx-auto max-w-3xl">
      <Link href="/" className="text-sm font-semibold text-brand-grey transition hover:text-brand-ink">← KAMP home</Link>
      <header className="mb-8 mt-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-ink/60">KAMP leadership</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Your place in the community</h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-brand-grey">Use the private invitation sent to your email to complete your membership registration.</p>
      </header>
      <section className="rounded-[24px] border border-white bg-white p-5 shadow-[0_20px_60px_rgba(32,32,32,0.07)] sm:p-8">
        <LeadershipInviteRegistration />
      </section>
    </div>
  </main>
}
