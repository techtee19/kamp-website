import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import ReviewLeaderRequest from '@/components/admin/ReviewLeaderRequest'
export const dynamic = 'force-dynamic'
export default async function AdminLeaderRequestDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id }=await params;if(!/^\d+$/.test(id))notFound()
  const [r]=await db`SELECT r.*,l.full_name,l.email,l.campus,l.role FROM leader_requests r JOIN leaders l ON l.id=r.leader_id WHERE r.id=${Number(id)} LIMIT 1`
  if(!r)notFound()
  return <div className="mx-auto max-w-4xl space-y-5 p-5 sm:p-8"><Link href="/admin/requests" className="text-sm text-black/50">← Requests</Link><header className="pt-4"><p className="text-[11px] font-semibold uppercase tracking-[.18em] text-black/45">{String(r.campus)} · {String(r.request_type)}</p><h1 className="mt-2 font-display text-3xl font-semibold">{String(r.title)}</h1><p className="mt-2 text-sm text-black/55">{String(r.full_name)} · {String(r.email)}</p></header><section className="space-y-4 rounded-2xl border border-black/[.06] bg-white p-6"><p className="whitespace-pre-wrap text-sm leading-7">{String(r.description)}</p><div className="grid gap-3 border-t border-black/[.06] pt-4 text-sm sm:grid-cols-2"><p>Event: {String(r.event_name||'—')}</p><p>Event date: {String(r.event_date||'—')}</p><p>Amount: {r.amount_requested?`₦${Number(r.amount_requested).toLocaleString('en-NG')}`:'—'}</p><p>Needed by: {String(r.needed_by||'—')}</p></div>{r.budget_breakdown&&<p className="whitespace-pre-wrap text-sm"><strong>Budget breakdown:</strong><br/>{String(r.budget_breakdown)}</p>}{r.links&&<a href={String(r.links)} target="_blank" rel="noreferrer" className="text-sm text-blue-700 underline">Supporting link</a>}</section><ReviewLeaderRequest id={Number(r.id)} status={String(r.status)} note={String(r.review_note||'')}/></div>
}
