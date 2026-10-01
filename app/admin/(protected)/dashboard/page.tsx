import Link from 'next/link'
import { db } from '@/lib/db'
import { quoteEventTableName } from '@/lib/admin-data'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const [memberCount, newThisMonth, registry, recentMembers] = await Promise.all([
    db`SELECT COUNT(*)::int AS count FROM members WHERE status = 'active'`,
    db`SELECT COUNT(*)::int AS count FROM members WHERE joined_at >= date_trunc('month', NOW())`,
    db`SELECT table_name FROM event_tables_registry`,
    db`SELECT member_id, first_name, last_name, university, joined_at FROM members ORDER BY joined_at DESC LIMIT 5`,
  ])

  const counts = await Promise.all(registry.map(async (event) => {
    const table = quoteEventTableName(event.table_name)
    const result = await db.unsafe(`SELECT COUNT(*)::int AS count FROM ${table} WHERE status <> 'cancelled'`)
    return Number(result[0].count)
  }))
  const totalRegistrations = counts.reduce((sum, count) => sum + count, 0)
  const stats = [
    { label: 'Active members', value: Number(memberCount[0].count) },
    { label: 'Joined this month', value: Number(newThisMonth[0].count) },
    { label: 'Events', value: registry.length },
    { label: 'Event registrations', value: totalRegistrations },
  ]

  return <div className="p-5 sm:p-8">
    <h1 className="mb-8 font-display text-2xl font-bold text-brand-black">Dashboard</h1>
    <section aria-label="Overview statistics" className="mb-10 grid grid-cols-2 gap-4 xl:grid-cols-4">
      {stats.map((stat) => <article key={stat.label} className="rounded-xl border border-brand-card bg-white p-5 sm:p-6"><p className="mb-2 text-xs uppercase tracking-widest text-brand-grey">{stat.label}</p><p className="font-display text-3xl font-bold text-brand-gold">{stat.value.toLocaleString()}</p></article>)}
    </section>
    <section className="overflow-hidden rounded-xl border border-brand-card bg-white">
      <header className="flex items-center justify-between border-b border-brand-card px-5 py-4 sm:px-6"><h2 className="font-semibold text-brand-black">Recent members</h2><Link href="/admin/members" className="text-sm font-semibold text-brand-ink hover:underline">All members</Link></header>
      <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-brand-card text-xs uppercase tracking-widest text-brand-grey">{['Member ID', 'Name', 'Institution', 'Joined'].map((heading) => <th key={heading} className="whitespace-nowrap px-5 py-3 font-semibold sm:px-6">{heading}</th>)}</tr></thead><tbody>
        {recentMembers.length === 0 ? <tr><td colSpan={4} className="px-6 py-10 text-center text-sm text-brand-grey">No members yet.</td></tr> : recentMembers.map((member) => <tr key={member.member_id as string} className="border-b border-brand-card last:border-0"><td className="whitespace-nowrap px-5 py-4 font-mono text-xs font-semibold text-brand-gold sm:px-6">{member.member_id as string}</td><td className="whitespace-nowrap px-5 py-4 text-sm text-brand-black sm:px-6">{member.first_name as string} {member.last_name as string}</td><td className="px-5 py-4 text-sm text-brand-grey sm:px-6">{member.university as string}</td><td className="whitespace-nowrap px-5 py-4 text-sm text-brand-grey sm:px-6">{new Date(member.joined_at as string).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' })}</td></tr>)}
      </tbody></table></div>
    </section>
  </div>
}
