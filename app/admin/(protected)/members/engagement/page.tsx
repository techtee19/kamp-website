import Link from 'next/link'
import { db } from '@/lib/db'
import CommunityStatusButton from '@/components/admin/CommunityStatusButton'
import CommunityEmailCampaign from '@/components/admin/CommunityEmailCampaign'

export const dynamic = 'force-dynamic'
const PAGE_SIZE = 50
const filters = [
  { value: '', label: 'All members' },
  { value: 'missing-photo', label: 'Missing photo' },
  { value: 'not-joined', label: 'Not verified as joined' },
  { value: 'clicked-not-joined', label: 'Clicked, not verified' },
] as const

function safePage(value: string | undefined) {
  const parsed = Number.parseInt(value ?? '1', 10)
  return Number.isSafeInteger(parsed) && parsed > 0 ? Math.min(parsed, 1_000_000) : 1
}

function formatDate(value: unknown) {
  return value ? new Date(value as string).toLocaleDateString('en-NG', { dateStyle: 'medium', timeZone: 'Africa/Lagos' }) : null
}

export default async function MemberEngagementPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string; filter?: string }> }) {
  const [schemaStatus] = await db`
    SELECT to_regclass('public.member_community_tracking') IS NOT NULL
      AND to_regclass('public.member_community_invite_links') IS NOT NULL AS ready
  `
  if (!schemaStatus?.ready) return <div className="mx-auto max-w-3xl p-5 sm:p-8"><Link href="/admin/members" className="text-sm text-brand-grey hover:text-brand-black">← Back to members</Link><section className="mt-6 rounded-2xl border border-amber-200 bg-white p-6"><h1 className="font-display text-2xl font-bold text-brand-black">Member follow-up tracking is not set up yet</h1><p className="mt-3 text-sm leading-relaxed text-brand-grey">Apply <code className="rounded bg-brand-cream px-1.5 py-0.5">013_member_engagement_tracking.sql</code> to this database. Existing member photos and records are unchanged. Registration and welcome emails continue to work while this optional tracking migration is pending.</p></section></div>

  const params = await searchParams
  const query = (params.q ?? '').trim().slice(0, 100)
  const filter = filters.some((option) => option.value === params.filter) ? (params.filter ?? '') : ''
  const page = safePage(params.page)
  const offset = (page - 1) * PAGE_SIZE
  const pattern = `%${query.toLowerCase().replace(/[\\%_]/g, (character) => `\\${character}`)}%`
  const [members, countRows, summaryRows] = await Promise.all([
    db`
      SELECT m.member_id, m.first_name, m.last_name, m.email,
        (m.passport_photo IS NOT NULL) AS has_photo,
        tracking.joined_at,
        COALESCE(links.sent_count, 0)::int AS sent_count,
        COALESCE(links.click_count, 0)::int AS click_count,
        links.last_clicked_at
      FROM members AS m
      LEFT JOIN member_community_tracking AS tracking USING (member_id)
      LEFT JOIN LATERAL (
        SELECT (COUNT(*) FILTER (WHERE email_sent_at IS NOT NULL))::int AS sent_count,
          COALESCE(SUM(click_count), 0)::int AS click_count,
          MAX(last_clicked_at) AS last_clicked_at
        FROM member_community_invite_links WHERE member_id = m.member_id
      ) AS links ON TRUE
      WHERE (${query === ''} OR LOWER(m.member_id) LIKE ${pattern} ESCAPE '\\'
        OR LOWER(m.first_name) LIKE ${pattern} ESCAPE '\\' OR LOWER(m.last_name) LIKE ${pattern} ESCAPE '\\'
        OR LOWER(m.email) LIKE ${pattern} ESCAPE '\\')
        AND (${filter === ''}
          OR (${filter === 'missing-photo'} AND m.passport_photo IS NULL)
          OR (${filter === 'not-joined'} AND tracking.joined_at IS NULL)
          OR (${filter === 'clicked-not-joined'} AND tracking.joined_at IS NULL AND COALESCE(links.click_count, 0) > 0))
      ORDER BY m.joined_at DESC, m.member_id ASC
      LIMIT ${PAGE_SIZE} OFFSET ${offset}
    `,
    db`
      SELECT COUNT(*)::int AS count
      FROM members AS m
      LEFT JOIN member_community_tracking AS tracking USING (member_id)
      LEFT JOIN LATERAL (
        SELECT COALESCE(SUM(click_count), 0)::int AS click_count
        FROM member_community_invite_links WHERE member_id = m.member_id
      ) AS links ON TRUE
      WHERE (${query === ''} OR LOWER(m.member_id) LIKE ${pattern} ESCAPE '\\'
        OR LOWER(m.first_name) LIKE ${pattern} ESCAPE '\\' OR LOWER(m.last_name) LIKE ${pattern} ESCAPE '\\'
        OR LOWER(m.email) LIKE ${pattern} ESCAPE '\\')
        AND (${filter === ''}
          OR (${filter === 'missing-photo'} AND m.passport_photo IS NULL)
          OR (${filter === 'not-joined'} AND tracking.joined_at IS NULL)
          OR (${filter === 'clicked-not-joined'} AND tracking.joined_at IS NULL AND COALESCE(links.click_count, 0) > 0))
    `,
    db`
      SELECT COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE passport_photo IS NULL)::int AS missing_photo,
        COUNT(*) FILTER (WHERE tracking.joined_at IS NOT NULL)::int AS verified_joined
      FROM members
      LEFT JOIN member_community_tracking AS tracking USING (member_id)
    `,
  ])
  const totalCount = Number(countRows[0]?.count ?? 0)
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const summary = summaryRows[0]
  const linkFor = (nextPage: number) => {
    const search = new URLSearchParams()
    if (query) search.set('q', query)
    if (filter) search.set('filter', filter)
    search.set('page', String(nextPage))
    return `/admin/members/engagement?${search.toString()}`
  }

  return <div className="mx-auto max-w-[1500px] space-y-6 p-5 sm:p-8">
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div><Link href="/admin/members" className="text-sm text-brand-grey hover:text-brand-black">← Back to members</Link><p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-ink/65">KAMP / MEMBERS</p><h1 className="mt-2 font-display text-2xl font-bold text-brand-black sm:text-3xl">Member follow-up</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-grey">Check for missing profile photos and follow WhatsApp community link activity. A link click does not confirm group membership; admins mark joins after verifying them. Older direct WhatsApp links cannot be tracked retroactively.</p></div>
    </header>

    <section aria-label="Member follow-up summary" className="grid gap-3 sm:grid-cols-3">
      {[
        { label: 'Members', value: Number(summary.total) },
        { label: 'Missing photos', value: Number(summary.missing_photo) },
        { label: 'Verified WhatsApp joins', value: Number(summary.verified_joined) },
      ].map((item) => <article key={item.label} className="rounded-2xl border border-brand-card bg-white p-5"><p className="text-xs font-semibold uppercase tracking-widest text-brand-grey">{item.label}</p><p className="mt-2 font-display text-3xl font-bold text-brand-ink">{item.value.toLocaleString()}</p></article>)}
    </section>

    <CommunityEmailCampaign />

    <form action="/admin/members/engagement" className="grid gap-3 rounded-2xl border border-brand-card bg-white p-4 sm:grid-cols-[minmax(0,1fr)_240px_auto] sm:items-end">
      <label className="text-xs font-semibold text-brand-ink">Search members<input name="q" defaultValue={query} placeholder="Name, email, or member ID" className="mt-2 min-h-11 w-full rounded-xl border border-brand-ink/15 px-4 text-sm font-normal outline-none focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/15" /></label>
      <label className="text-xs font-semibold text-brand-ink">Follow-up filter<select name="filter" defaultValue={filter} className="mt-2 min-h-11 w-full rounded-xl border border-brand-ink/15 bg-white px-3 text-sm font-normal outline-none focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/15">{filters.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
      <button type="submit" className="min-h-11 rounded-full bg-brand-ink px-5 text-sm font-semibold text-white hover:bg-brand-black">Apply</button>
    </form>

    <section className="overflow-hidden rounded-2xl border border-brand-card bg-white">
      <div className="border-b border-brand-card px-5 py-4"><h2 className="font-semibold text-brand-black">{totalCount.toLocaleString()} {totalCount === 1 ? 'member' : 'members'}</h2></div>
      <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-brand-card bg-brand-cream text-xs uppercase tracking-widest text-brand-grey">{['Member', 'Photo', 'WhatsApp link', 'Joined status', 'Admin action'].map((heading) => <th key={heading} className="whitespace-nowrap px-4 py-3 font-semibold">{heading}</th>)}</tr></thead><tbody>
        {members.length === 0 ? <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-brand-grey">No members match this search.</td></tr> : members.map((member) => {
          const hasPhoto = Boolean(member.has_photo)
          const joined = Boolean(member.joined_at)
          const clicks = Number(member.click_count ?? 0)
          const sentCount = Number(member.sent_count ?? 0)
          const linkStatus = clicks > 0 ? `Clicked${member.last_clicked_at ? ` · ${formatDate(member.last_clicked_at)}` : ''}` : sentCount > 0 ? 'Email sent · no tracked click' : 'No tracked link sent'
          const profileUrl = `/admin/members/${encodeURIComponent(String(member.member_id))}`
          return <tr key={String(member.member_id)} className="border-b border-brand-card last:border-0">
            <td className="min-w-56 px-4 py-4"><Link href={profileUrl} className="font-semibold text-brand-ink hover:underline">{String(member.first_name)} {String(member.last_name)}</Link><p className="mt-1 font-mono text-xs text-brand-gold">{String(member.member_id)}</p><p className="mt-1 text-xs text-brand-grey">{String(member.email)}</p></td>
            <td className="whitespace-nowrap px-4 py-4"><span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${hasPhoto ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'}`}>{hasPhoto ? 'Photo saved' : 'Missing photo'}</span></td>
            <td className="min-w-48 px-4 py-4"><span className="text-sm text-brand-ink">{linkStatus}</span>{clicks > 0 && <p className="mt-1 text-xs text-brand-grey">{clicks} tracked {clicks === 1 ? 'click' : 'clicks'}</p>}</td>
            <td className="whitespace-nowrap px-4 py-4"><span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${joined ? 'bg-emerald-50 text-emerald-700' : 'bg-brand-cream text-brand-grey'}`}>{joined ? `Joined · ${formatDate(member.joined_at)}` : 'Not verified'}</span></td>
            <td className="px-4 py-4"><CommunityStatusButton memberId={String(member.member_id)} joined={joined} /></td>
          </tr>
        })}
      </tbody></table></div>
      {totalPages > 1 && <nav aria-label="Follow-up pages" className="flex items-center justify-between border-t border-brand-card px-4 py-3"><span className="text-xs text-brand-grey">Page {currentPage} of {totalPages}</span><div className="flex gap-2">{currentPage > 1 && <Link href={linkFor(currentPage - 1)} className="rounded-lg border border-brand-card px-3 py-1.5 text-xs hover:bg-brand-cream">Previous</Link>}{currentPage < totalPages && <Link href={linkFor(currentPage + 1)} className="rounded-lg border border-brand-card px-3 py-1.5 text-xs hover:bg-brand-cream">Next</Link>}</div></nav>}
    </section>
  </div>
}
