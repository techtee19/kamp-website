import Link from 'next/link'
import { db } from '@/lib/db'
import {
  getGenderBreakdown,
  getMonthlySignups,
  getStudyLevelBreakdown,
  getTotalEventRegistrations,
  getTopStates,
  getTopUniversities,
  getYearOnYearGrowth,
} from '@/lib/admin-analytics'
import SignupTrendChart from '@/components/admin/charts/SignupTrendChart'
import UniversityChart from '@/components/admin/charts/UniversityChart'
import StatesChart from '@/components/admin/charts/StatesChart'
import GenderBreakdown from '@/components/admin/charts/GenderBreakdown'
import StudyLevelBreakdown from '@/components/admin/charts/StudyLevelBreakdown'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const [memberCount, newThisMonth, eventCount, recentMembers, monthlySignups, topUniversities, topStates, studyLevels, genderData, yoyGrowth, totalRegistrations] = await Promise.all([
    db`SELECT COUNT(*)::int AS count FROM members WHERE status = 'active'`,
    db`SELECT COUNT(*)::int AS count FROM members WHERE joined_at >= date_trunc('month', NOW())`,
    db`SELECT COUNT(*)::int AS count FROM event_tables_registry`,
    db`SELECT member_id, first_name, last_name, university, joined_at FROM members ORDER BY joined_at DESC LIMIT 5`,
    getMonthlySignups(),
    getTopUniversities(),
    getTopStates(),
    getStudyLevelBreakdown(),
    getGenderBreakdown(),
    getYearOnYearGrowth(),
    getTotalEventRegistrations(),
  ])

  const growthLabel = yoyGrowth.growthPercent === null
    ? 'New'
    : `${yoyGrowth.growthPercent > 0 ? '+' : ''}${yoyGrowth.growthPercent}%`
  const stats = [
    { label: 'Active members', value: Number(memberCount[0].count).toLocaleString(), detail: `+${Number(newThisMonth[0].count).toLocaleString()} joined this month`, highlight: false },
    { label: 'Member growth', value: growthLabel, detail: `${yoyGrowth.currentYearCount.toLocaleString()} this year vs ${yoyGrowth.previousYearCount.toLocaleString()} by this date last year`, highlight: true },
    { label: 'Events', value: Number(eventCount[0].count).toLocaleString(), detail: 'with registration tables', highlight: false },
    { label: 'Event registrations', value: totalRegistrations.toLocaleString(), detail: 'across all events', highlight: false },
  ]

  return <div className="p-5 sm:p-8">
    <h1 className="mb-8 font-display text-2xl font-bold text-brand-black">Dashboard</h1>
    <section aria-label="Overview statistics" className="mb-10 grid grid-cols-2 gap-4 xl:grid-cols-4">
      {stats.map((stat) => <article key={stat.label} className={`rounded-xl border border-brand-card p-5 sm:p-6 ${stat.highlight ? 'bg-brand-black' : 'bg-white'}`}><p className={`mb-2 text-xs uppercase tracking-widest ${stat.highlight ? 'text-brand-gold/70' : 'text-brand-grey'}`}>{stat.label}</p><p className={`font-display text-3xl font-bold ${stat.highlight ? 'text-brand-gold' : 'text-brand-black'}`}>{stat.value}</p><p className={`mt-2 text-xs leading-relaxed ${stat.highlight ? 'text-white/60' : 'text-brand-grey'}`}>{stat.detail}</p></article>)}
    </section>

    <section aria-label="Member analytics" className="mb-10 space-y-5">
      <div className="grid gap-5 xl:grid-cols-2">
        <article className="rounded-xl border border-brand-card bg-white p-5 sm:p-6">
          <header className="mb-3"><h2 className="font-semibold text-brand-black">Member signups</h2><p className="mt-1 text-xs text-brand-grey">Monthly trend over the last 12 months</p></header>
          <SignupTrendChart data={monthlySignups} />
        </article>
        <article className="rounded-xl border border-brand-card bg-white p-5 sm:p-6">
          <header className="mb-3"><h2 className="font-semibold text-brand-black">Top universities</h2><p className="mt-1 text-xs text-brand-grey">Institutions with the most members</p></header>
          <UniversityChart data={topUniversities} />
        </article>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <article className="rounded-xl border border-brand-card bg-white p-5 sm:p-6">
          <header className="mb-3"><h2 className="font-semibold text-brand-black">Top states of origin</h2><p className="mt-1 text-xs text-brand-grey">Member distribution by state</p></header>
          <StatesChart data={topStates} />
        </article>
        <article className="rounded-xl border border-brand-card bg-white p-5 sm:p-6">
          <header className="mb-5"><h2 className="font-semibold text-brand-black">Gender split</h2><p className="mt-1 text-xs text-brand-grey">Share of all registered members</p></header>
          <GenderBreakdown data={genderData} />
        </article>
      </div>

      <article className="rounded-xl border border-brand-card bg-white p-5 sm:p-6">
        <header className="mb-5"><h2 className="font-semibold text-brand-black">Level of study</h2><p className="mt-1 text-xs text-brand-grey">Member distribution by current study level</p></header>
        <StudyLevelBreakdown data={studyLevels} />
      </article>
    </section>

    <section className="overflow-hidden rounded-xl border border-brand-card bg-white">
      <header className="flex items-center justify-between border-b border-brand-card px-5 py-4 sm:px-6"><h2 className="font-semibold text-brand-black">Recent members</h2><Link href="/admin/members" className="text-sm font-semibold text-brand-ink hover:underline">All members</Link></header>
      <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-brand-card text-xs uppercase tracking-widest text-brand-grey">{['Member ID', 'Name', 'Institution', 'Joined'].map((heading) => <th key={heading} className="whitespace-nowrap px-5 py-3 font-semibold sm:px-6">{heading}</th>)}</tr></thead><tbody>
        {recentMembers.length === 0 ? <tr><td colSpan={4} className="px-6 py-10 text-center text-sm text-brand-grey">No members yet.</td></tr> : recentMembers.map((member) => <tr key={member.member_id as string} className="border-b border-brand-card last:border-0"><td className="whitespace-nowrap px-5 py-4 font-mono text-xs font-semibold text-brand-gold sm:px-6">{member.member_id as string}</td><td className="whitespace-nowrap px-5 py-4 text-sm text-brand-black sm:px-6">{member.first_name as string} {member.last_name as string}</td><td className="px-5 py-4 text-sm text-brand-grey sm:px-6">{member.university as string}</td><td className="whitespace-nowrap px-5 py-4 text-sm text-brand-grey sm:px-6">{new Date(member.joined_at as string).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' })}</td></tr>)}
      </tbody></table></div>
    </section>
  </div>
}
