import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { requireLeader } from '@/lib/leader-auth'
export const dynamic = 'force-dynamic'
export default async function LeaderRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const leader = await requireLeader(); const { id } = await params
  if (!/^\d+$/.test(id)) notFound()
  const [item] = await db`SELECT * FROM leader_requests WHERE id = ${Number(id)} AND leader_id = ${leader.id} LIMIT 1`
  if (!item) notFound()
  return <article className="mx-auto max-w-3xl"><Link href="/leaders/dashboard" className="text-sm text-black/50 hover:text-black">← Overview</Link><p className="mt-7 text-[11px] font-semibold uppercase tracking-[.2em] text-brand-gold">{String(item.request_type).replaceAll('_', ' ').toUpperCase()} REQUEST</p><div className="mt-2 flex flex-wrap items-center justify-between gap-3"><h1 className="font-display text-3xl font-semibold">{String(item.title)}</h1><span className="rounded-full bg-brand-cream px-4 py-2 text-xs font-semibold capitalize">{String(item.status).replaceAll('_', ' ')}</span></div><div className="mt-7 space-y-5 rounded-[1.75rem] border border-black/[.06] bg-white p-6 sm:p-8"><section><h2 className="text-xs font-semibold uppercase tracking-widest text-black/45">Your request</h2><p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-black/75">{String(item.description)}</p></section>{item.amount_requested && <p className="text-sm">Amount requested: ₦{Number(item.amount_requested).toLocaleString('en-NG')}</p>}{item.budget_breakdown && <section><h2 className="text-xs font-semibold uppercase tracking-widest text-black/45">Budget breakdown</h2><p className="mt-2 whitespace-pre-wrap text-sm leading-7">{String(item.budget_breakdown)}</p></section>}{item.review_note && <section className="rounded-xl bg-brand-cream p-4"><h2 className="text-xs font-semibold uppercase tracking-widest text-black/45">Note from KAMP</h2><p className="mt-2 whitespace-pre-wrap text-sm leading-6">{String(item.review_note)}</p></section>}</div></article>
}
