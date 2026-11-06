import Link from 'next/link'
import LeaderReportForm from '@/components/leaders/LeaderReportForm'

export default function NewLeaderReportPage() {
  return (
    <section className="mx-auto max-w-3xl">
      <Link href="/leaders/dashboard" className="text-sm text-black/50 transition hover:text-black">← Overview</Link>
      <p className="mt-7 text-[11px] font-semibold uppercase tracking-[.2em] text-brand-gold">CAMPUS UPDATE</p>
      <h1 className="mt-2 font-display text-3xl font-semibold">Submit a report</h1>
      <p className="mb-7 mt-2 text-sm leading-6 text-black/55">Share a clear picture of your campus work with the KAMP team.</p>
      <div className="rounded-[1.75rem] border border-black/[.06] bg-white p-5 shadow-[0_12px_40px_rgba(35,32,23,.04)] sm:p-8">
        <LeaderReportForm />
      </div>
    </section>
  )
}
