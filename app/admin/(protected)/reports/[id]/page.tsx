import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
export const dynamic = 'force-dynamic'
export default async function AdminLeaderReportDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; if (!/^\d+$/.test(id)) notFound()
  const [r] = await db`SELECT r.*,l.full_name,l.email,l.campus,l.role FROM leader_reports r JOIN leaders l ON l.id=r.leader_id WHERE r.id=${Number(id)} LIMIT 1`
  if (!r) notFound()
  return <article className="mx-auto max-w-4xl space-y-5 p-5 sm:p-8"><Link href="/admin/reports" className="text-sm text-black/50">← Reports</Link><header><p className="mt-5 text-[11px] font-semibold uppercase tracking-[.18em] text-black/45">{String(r.campus)} · {String(r.report_type)}</p><h1 className="mt-2 font-display text-3xl font-semibold">{String(r.title)}</h1><p className="mt-2 text-sm text-black/55">{String(r.full_name)} · {String(r.email)} · {String(r.report_date)}</p></header><div className="space-y-5 rounded-2xl border border-black/[.06] bg-white p-6">{[['Summary',r.summary],['Achievements',r.achievements],['Challenges',r.challenges],['Next steps',r.next_steps]].map(([label,value])=>value?<section key={String(label)}><h2 className="text-xs font-semibold uppercase tracking-widest text-black/45">{label}</h2><p className="mt-2 whitespace-pre-wrap text-sm leading-7">{String(value)}</p></section>:null)}<div className="grid gap-3 border-t border-black/[.06] pt-4 text-sm sm:grid-cols-2"><p>Events held: {String(r.events_held??'—')}</p><p>Attendance: {String(r.attendance??'—')}</p></div>{r.links&&<a href={String(r.links)} target="_blank" rel="noreferrer" className="text-sm text-blue-700 underline">Supporting link</a>}</div></article>
}
