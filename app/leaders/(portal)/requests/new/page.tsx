import Link from 'next/link'
import LeaderRequestForm from '@/components/leaders/LeaderRequestForm'

export default function NewLeaderRequestPage() {
  return (
    <section className="mx-auto max-w-3xl">
      <Link href="/leaders/dashboard" className="text-sm text-black/50 transition hover:text-black">← Overview</Link>
      <p className="mt-7 text-[11px] font-semibold uppercase tracking-[.2em] text-brand-gold">SUPPORT FOR YOUR CAMPUS</p>
      <h1 className="mt-2 font-display text-3xl font-semibold">Request support</h1>
      <p className="mb-7 mt-2 text-sm leading-6 text-black/55">Tell us what would help your team take its next step. Funding requests need an amount and a clear budget breakdown.</p>
      <div className="rounded-[1.75rem] border border-black/[.06] bg-white p-5 shadow-[0_12px_40px_rgba(35,32,23,.04)] sm:p-8">
        <LeaderRequestForm />
      </div>
    </section>
  )
}
