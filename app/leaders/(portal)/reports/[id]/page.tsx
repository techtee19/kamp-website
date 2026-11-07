import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { requireLeader } from '@/lib/leader-auth'
export const dynamic = 'force-dynamic'
export default async function LeaderReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const leader = await requireLeader(); const { id } = await params
  if (!/^\d+$/.test(id)) notFound()
  const [report] = await db`SELECT * FROM leader_reports WHERE id = ${Number(id)} AND leader_id = ${leader.id} LIMIT 1`
  if (!report) notFound()
  const sections = [['Summary', report.summary], ['Achievements', report.achievements], ['Challenges', report.challenges], ['Next steps', report.next_steps]] as const
  return <article className="mx-auto max-w-3xl"><Link href="/leaders/dashboard" className="text-sm text-black/50 hover:text-black">← Overview</Link><p className="mt-7 text-[11px] font-semibold uppercase tracking-[.2em] text-brand-gold">{String(report.report_type).toUpperCase()} REPORT · {String(report.report_date)}</p><h1 className="mt-2 font-display text-3xl font-semibold">{String(report.title)}</h1><div className="mt-7 space-y-5 rounded-[1.75rem] border border-black/[.06] bg-white p-6 sm:p-8">{sections.map(([label, value]) => value ? <section key={label}><h2 className="text-xs font-semibold uppercase tracking-widest text-black/45">{label}</h2><p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-black/75">{String(value)}</p></section> : null)}<div className="grid gap-4 border-t border-black/[.06] pt-5 text-sm text-black/65 sm:grid-cols-2"><p>Events held: {String(report.events_held ?? '—')}</p><p>Attendance: {String(report.attendance ?? '—')}</p></div>{report.links && <a className="text-sm text-blue-700 underline" href={String(report.links)} target="_blank" rel="noreferrer">Supporting link</a>}</div></article>
}
