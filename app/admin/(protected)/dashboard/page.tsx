import Link from 'next/link'
import { cache, Suspense } from 'react'
import { db } from '@/lib/db'
import {
  getGenderBreakdown,
  getMembershipTypeBreakdown,
  getMonthlySignups,
  getStudyLevelBreakdown,
  getTotalEventRegistrations,
  getTopStates,
  getUniversities,
  getYearOnYearGrowth,
} from '@/lib/admin-analytics'
import SignupTrendChart from '@/components/admin/charts/SignupTrendChart'
import UniversityChart from '@/components/admin/charts/UniversityChart'
import UniversityDirectory from '@/components/admin/UniversityDirectory'
import StatesChart from '@/components/admin/charts/StatesChart'
import GenderBreakdown from '@/components/admin/charts/GenderBreakdown'
import StudyLevelBreakdown from '@/components/admin/charts/StudyLevelBreakdown'
import MembershipTypeBreakdown from '@/components/admin/charts/MembershipTypeBreakdown'
import { CalendarDays, ChartNoAxesCombined, UserRoundCheck, UsersRound } from 'lucide-react'

export const dynamic = 'force-dynamic'
const getDashboardUniversities = cache(getUniversities)

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-[1600px] p-4 sm:p-7 xl:p-9">
      <header className="mb-7 flex flex-wrap items-end justify-between gap-4 sm:mb-8">
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-ink/65">KAMP / OVERVIEW</p>
          <h1 className="font-display text-3xl font-bold tracking-[-0.035em] text-brand-black sm:text-4xl">Dashboard</h1>
          <p className="mt-2 text-sm text-brand-grey">Membership and event activity at a glance.</p>
        </div>
        <Link href="/admin/members" className="group inline-flex min-h-10 items-center gap-2 rounded-full border border-brand-card bg-white px-4 text-sm font-semibold text-brand-ink shadow-[0_1px_2px_rgba(32,32,32,0.03)] transition hover:border-brand-ink/30 hover:bg-brand-cream active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100">
          View members <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none">↗</span>
        </Link>
      </header>

      <Suspense fallback={<OverviewLoading />}>
        <DashboardOverview />
      </Suspense>

      <DashboardAnalytics />

      <Suspense fallback={<RecentMembersLoading />}>
        <RecentMembers />
      </Suspense>
    </div>
  )
}

async function DashboardOverview() {
  try {
  const [memberCount, newThisMonth, eventCount, yoyGrowth] = await Promise.all([
    db`SELECT COUNT(*)::int AS count FROM members WHERE status = 'active'`,
    db`SELECT COUNT(*)::int AS count FROM members WHERE joined_at >= date_trunc('month', NOW())`,
    db`SELECT COUNT(*)::int AS count
      FROM event_tables_registry AS registry
      WHERE EXISTS (
        SELECT 1
        FROM pg_catalog.pg_tables AS event_table
        WHERE event_table.schemaname = 'public'
          AND event_table.tablename = registry.table_name
      )`,
    getYearOnYearGrowth(),
  ])

  const growthLabel = yoyGrowth.growthPercent === null
    ? 'New'
    : `${yoyGrowth.growthPercent > 0 ? '+' : ''}${yoyGrowth.growthPercent}%`
  const stats = [
    { label: 'Active members', value: Number(memberCount[0].count).toLocaleString(), detail: `+${Number(newThisMonth[0].count).toLocaleString()} joined this month`, Icon: UsersRound, highlight: false },
    { label: 'Member growth', value: growthLabel, detail: `${yoyGrowth.currentYearCount.toLocaleString()} this year vs ${yoyGrowth.previousYearCount.toLocaleString()} by this date last year`, Icon: ChartNoAxesCombined, highlight: true },
    { label: 'Events', value: Number(eventCount[0].count).toLocaleString(), detail: 'with registration tables', Icon: CalendarDays, highlight: false },
  ]

  return (
    <section aria-label="Overview statistics" className="mb-9 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map(({ Icon, ...stat }) => <article key={stat.label} className={`rounded-2xl border p-4 shadow-[0_1px_2px_rgba(32,32,32,0.03)] sm:p-5 ${stat.highlight ? 'border-brand-black bg-brand-black' : 'border-brand-card bg-white'}`}><div className="mb-4 flex items-center justify-between gap-3"><p className={`text-[11px] font-semibold uppercase tracking-[0.12em] ${stat.highlight ? 'text-white/60' : 'text-brand-grey'}`}>{stat.label}</p><span className={`grid size-9 place-items-center rounded-xl ${stat.highlight ? 'bg-white/10 text-brand-gold' : 'bg-brand-cream text-brand-ink'}`}><Icon aria-hidden="true" size={17} strokeWidth={1.7} /></span></div><p className={`font-display text-3xl font-bold tracking-[-0.035em] sm:text-[2rem] ${stat.highlight ? 'text-brand-gold' : 'text-brand-black'}`}>{stat.value}</p><p className={`mt-2 min-h-9 text-xs leading-relaxed ${stat.highlight ? 'text-white/55' : 'text-brand-grey'}`}>{stat.detail}</p></article>)}
      <Suspense fallback={<EventRegistrationsLoading />}><EventRegistrationsOverview /></Suspense>
    </section>
  )
  } catch (error) {
    console.error('[admin dashboard] Overview statistics failed:', error)
    return <UnavailablePanel title="Overview statistics" />
  }
}

function DashboardAnalytics() {
  return <section aria-label="Member analytics" className="mb-9 space-y-4">
    <div className="grid gap-5 xl:grid-cols-2">
      <Suspense fallback={<AnalyticsPanelLoading />}><SignupTrendPanel /></Suspense>
      <Suspense fallback={<AnalyticsPanelLoading />}><UniversityPanel /></Suspense>
    </div>
    <div className="grid gap-5 xl:grid-cols-2">
      <Suspense fallback={<AnalyticsPanelLoading />}><StatesPanel /></Suspense>
      <Suspense fallback={<AnalyticsPanelLoading />}><GenderPanel /></Suspense>
    </div>
    <div className="grid gap-5 xl:grid-cols-2">
      <Suspense fallback={<AnalyticsPanelLoading />}><MembershipTypePanel /></Suspense>
      <Suspense fallback={<AnalyticsPanelLoading />}><StudyLevelPanel /></Suspense>
    </div>
    <Suspense fallback={<AnalyticsDirectoryLoading />}><UniversityDirectoryPanel /></Suspense>
  </section>
}

async function EventRegistrationsOverview() {
  try {
    const total = await getTotalEventRegistrations()
    return <article className="rounded-2xl border border-brand-card bg-white p-4 shadow-[0_1px_2px_rgba(32,32,32,0.03)] sm:p-5"><div className="mb-4 flex items-center justify-between gap-3"><p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-grey">Event registrations</p><span className="grid size-9 place-items-center rounded-xl bg-brand-cream text-brand-ink"><UserRoundCheck aria-hidden="true" size={17} strokeWidth={1.7} /></span></div><p className="font-display text-3xl font-bold tracking-[-0.035em] sm:text-[2rem] text-brand-black">{total.count.toLocaleString()}</p><p className="mt-2 min-h-9 text-xs leading-relaxed text-brand-grey">{total.unavailableTables > 0 ? `${total.unavailableTables} event registration table(s) unavailable` : 'Across all events'}</p></article>
  } catch (error) {
    console.error('[admin dashboard] Event registration total failed:', error)
    return <UnavailablePanel title="Event registrations" />
  }
}

async function SignupTrendPanel() {
  try { return <article className="rounded-2xl border border-brand-card bg-white p-5 shadow-[0_1px_2px_rgba(32,32,32,0.03)] sm:p-6"><header className="mb-3"><h2 className="font-semibold text-brand-black">Member signups</h2><p className="mt-1 text-xs text-brand-grey">Monthly trend over the last 12 months</p></header><SignupTrendChart data={await getMonthlySignups()} /></article> }
  catch (error) { console.error('[admin dashboard] Signup trend failed:', error); return <UnavailablePanel title="Member signups" /> }
}

async function UniversityPanel() {
  try { const universities = await getDashboardUniversities(); return <article className="rounded-2xl border border-brand-card bg-white p-5 shadow-[0_1px_2px_rgba(32,32,32,0.03)] sm:p-6"><header className="mb-3"><h2 className="font-semibold text-brand-black">Top universities</h2><p className="mt-1 text-xs text-brand-grey">Institutions with the most student members</p></header><UniversityChart data={universities.slice(0, 10)} /></article> }
  catch (error) { console.error('[admin dashboard] University chart failed:', error); return <UnavailablePanel title="Top universities" /> }
}

async function UniversityDirectoryPanel() {
  try { const universities = await getDashboardUniversities(); return <article className="rounded-2xl border border-brand-card bg-white p-5 shadow-[0_1px_2px_rgba(32,32,32,0.03)] sm:p-6"><header className="mb-4 flex flex-wrap items-end justify-between gap-2"><div><h2 className="font-semibold text-brand-black">All universities</h2><p className="mt-1 text-xs text-brand-grey">Student members grouped by institution</p></div><p className="text-xs font-medium text-brand-grey">{universities.length.toLocaleString()} institutions · {universities.reduce((total, university) => total + university.count, 0).toLocaleString()} members</p></header><UniversityDirectory data={universities} /></article> }
  catch (error) { console.error('[admin dashboard] University directory failed:', error); return <UnavailablePanel title="All universities" /> }
}

async function StatesPanel() {
  try { return <article className="rounded-2xl border border-brand-card bg-white p-5 shadow-[0_1px_2px_rgba(32,32,32,0.03)] sm:p-6"><header className="mb-3"><h2 className="font-semibold text-brand-black">Top states of origin</h2><p className="mt-1 text-xs text-brand-grey">Member distribution by state</p></header><StatesChart data={await getTopStates()} /></article> }
  catch (error) { console.error('[admin dashboard] State chart failed:', error); return <UnavailablePanel title="Top states of origin" /> }
}

async function GenderPanel() {
  try { return <article className="rounded-2xl border border-brand-card bg-white p-5 shadow-[0_1px_2px_rgba(32,32,32,0.03)] sm:p-6"><header className="mb-5"><h2 className="font-semibold text-brand-black">Gender split</h2><p className="mt-1 text-xs text-brand-grey">Share of all registered members</p></header><GenderBreakdown data={await getGenderBreakdown()} /></article> }
  catch (error) { console.error('[admin dashboard] Gender breakdown failed:', error); return <UnavailablePanel title="Gender split" /> }
}

async function MembershipTypePanel() {
  try { return <article className="rounded-2xl border border-brand-card bg-white p-5 shadow-[0_1px_2px_rgba(32,32,32,0.03)] sm:p-6"><header className="mb-5"><h2 className="font-semibold text-brand-black">Membership categories</h2><p className="mt-1 text-xs text-brand-grey">Students, professionals, and non-professionals</p></header><MembershipTypeBreakdown data={await getMembershipTypeBreakdown()} /></article> }
  catch (error) { console.error('[admin dashboard] Membership breakdown failed:', error); return <UnavailablePanel title="Membership categories" /> }
}

async function StudyLevelPanel() {
  try { return <article className="rounded-2xl border border-brand-card bg-white p-5 shadow-[0_1px_2px_rgba(32,32,32,0.03)] sm:p-6"><header className="mb-5"><h2 className="font-semibold text-brand-black">Level of study</h2><p className="mt-1 text-xs text-brand-grey">Student member distribution by current study level</p></header><StudyLevelBreakdown data={await getStudyLevelBreakdown()} /></article> }
  catch (error) { console.error('[admin dashboard] Study level breakdown failed:', error); return <UnavailablePanel title="Level of study" /> }
}

function UnavailablePanel({ title }: { title: string }) {
  return <article className="flex min-h-72 flex-col justify-center rounded-2xl border border-brand-card bg-white p-6"><h2 className="font-semibold text-brand-black">{title}</h2><p className="mt-2 text-sm text-brand-grey">This section could not load right now. Refresh the page to try again.</p></article>
}
async function RecentMembers() {
  let recentMembers
  try {
    recentMembers = await db`SELECT member_id, first_name, last_name, membership_type, kamp_position, university, study_level, occupation, organization, joined_at FROM members ORDER BY joined_at DESC LIMIT 5`
  } catch (error) {
    console.error('[admin dashboard] Recent members failed:', error)
    return <UnavailablePanel title="Recent members" />
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-brand-card bg-white shadow-[0_1px_2px_rgba(32,32,32,0.03)]">
      <header className="flex items-center justify-between border-b border-brand-card px-5 py-4 sm:px-6"><h2 className="font-semibold text-brand-black">Recent members</h2><Link href="/admin/members" className="text-sm font-semibold text-brand-ink hover:underline">All members</Link></header>
      <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-brand-card text-xs uppercase tracking-widest text-brand-grey">{['Member ID', 'Name', 'Category', 'Profession / institution', 'Joined'].map((heading) => <th key={heading} className="whitespace-nowrap px-5 py-3 font-semibold sm:px-6">{heading}</th>)}</tr></thead><tbody>
        {recentMembers.length === 0 ? <tr><td colSpan={5} className="px-6 py-10 text-center text-sm text-brand-grey">No members yet.</td></tr> : recentMembers.map((member) => { const affiliation = member.membership_type === 'student' ? [member.university, member.study_level].filter(Boolean).join(' · ') : [member.occupation, member.organization].filter(Boolean).join(' · '); return <tr key={member.member_id as string} className="border-b border-brand-card last:border-0"><td className="whitespace-nowrap px-5 py-4 font-mono text-xs font-semibold text-brand-gold sm:px-6">{member.member_id as string}</td><td className="whitespace-nowrap px-5 py-4 text-sm text-brand-black sm:px-6">{member.first_name as string} {member.last_name as string}</td><td className="whitespace-nowrap px-5 py-4 text-sm capitalize text-brand-grey sm:px-6">{String(member.membership_type).replace('_', ' ')}</td><td className="px-5 py-4 text-sm text-brand-grey sm:px-6"><span className="font-semibold text-brand-ink">{member.kamp_position as string}</span><span className="mt-1 block">{affiliation || '—'}</span></td><td className="whitespace-nowrap px-5 py-4 text-sm text-brand-grey sm:px-6">{new Date(member.joined_at as string).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' })}</td></tr>})}
      </tbody></table></div>
    </section>
  )
}

function OverviewLoading() {
  return <div aria-label="Loading overview" aria-busy="true" className="mb-9 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-32 animate-pulse rounded-2xl bg-brand-card" />)}</div>
}

function EventRegistrationsLoading() {
  return <div aria-label="Loading event registration total" aria-busy="true" className="h-44 animate-pulse rounded-2xl bg-brand-card sm:h-44" />
}

function AnalyticsPanelLoading() {
  return <div aria-label="Loading analytics panel" aria-busy="true" className="h-72 animate-pulse rounded-2xl bg-brand-card" />
}

function AnalyticsDirectoryLoading() {
  return <div aria-label="Loading university directory" aria-busy="true" className="h-96 animate-pulse rounded-2xl bg-brand-card" />
}

function RecentMembersLoading() {
  return <div aria-label="Loading recent members" aria-busy="true" className="h-72 animate-pulse rounded-2xl bg-brand-card" />
}
