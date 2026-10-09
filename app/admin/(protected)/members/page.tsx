import Link from 'next/link'
import { db } from '@/lib/db'
import MembersSearch from '@/components/admin/MembersSearch'

export const dynamic = 'force-dynamic'
const PAGE_SIZE = 50

function escapeLike(value: string) {
  return value.replace(/[\\%_]/g, (character) => `\\${character}`)
}

export default async function AdminMembersPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const params = await searchParams
  const query = (params.q ?? '').trim().slice(0, 100)
  const pattern = `%${escapeLike(query.toLowerCase())}%`
  const parsedPage = Number.parseInt(params.page ?? '1', 10)
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1
  const offset = (page - 1) * PAGE_SIZE
  const [members, countResult] = await Promise.all([
    query
      ? db`SELECT member_id, first_name, last_name, email, phone, university, study_level, state_of_origin, status, joined_at FROM members WHERE (
          LOWER(first_name) LIKE ${pattern} ESCAPE '\\' OR LOWER(last_name) LIKE ${pattern} ESCAPE '\\' OR
          LOWER(email) LIKE ${pattern} ESCAPE '\\' OR LOWER(university) LIKE ${pattern} ESCAPE '\\' OR
          LOWER(member_id) LIKE ${pattern} ESCAPE '\\' OR LOWER(state_of_origin) LIKE ${pattern} ESCAPE '\\'
        ) ORDER BY joined_at DESC LIMIT ${PAGE_SIZE} OFFSET ${offset}`
      : db`SELECT member_id, first_name, last_name, email, phone, university, study_level, state_of_origin, status, joined_at FROM members ORDER BY joined_at DESC LIMIT ${PAGE_SIZE} OFFSET ${offset}`,
    query ? db`SELECT COUNT(*)::int AS count FROM members WHERE (
      LOWER(first_name) LIKE ${pattern} ESCAPE '\\' OR LOWER(last_name) LIKE ${pattern} ESCAPE '\\' OR
      LOWER(email) LIKE ${pattern} ESCAPE '\\' OR LOWER(university) LIKE ${pattern} ESCAPE '\\' OR
      LOWER(member_id) LIKE ${pattern} ESCAPE '\\' OR LOWER(state_of_origin) LIKE ${pattern} ESCAPE '\\'
    )` : db`SELECT COUNT(*)::int AS count FROM members`,
  ])

  const totalCount = Number(countResult[0].count)
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)
  const linkFor = (nextPage: number) => {
    const search = new URLSearchParams()
    if (query) search.set('q', query)
    search.set('page', String(nextPage))
    return `/admin/members?${search.toString()}`
  }

  return <div className="p-5 sm:p-8">
    <header className="mb-6 flex flex-wrap items-center justify-between gap-4"><div><h1 className="font-display text-2xl font-bold text-brand-black">Members</h1><p className="mt-1 text-sm text-brand-grey">{totalCount.toLocaleString()} members</p></div><a href="/admin/api/members/export" className="rounded-full bg-brand-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-black/80">Export CSV</a></header>
    <MembersSearch key={query} defaultValue={query} />
    <div className="mt-4 overflow-hidden rounded-xl border border-brand-card bg-white"><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-brand-card bg-brand-cream text-xs uppercase tracking-widest text-brand-grey">{['Member ID', 'Name', 'Email', 'Institution', 'Level', 'State', 'Status', 'Joined'].map((heading) => <th key={heading} className="whitespace-nowrap px-4 py-3 font-semibold">{heading}</th>)}</tr></thead><tbody>
      {members.length === 0 ? <tr><td colSpan={8} className="px-4 py-12 text-center text-sm text-brand-grey">{query ? `No members found for “${query}”.` : 'No members yet.'}</td></tr> : members.map((member) => <tr key={member.member_id as string} className="border-b border-brand-card last:border-0 hover:bg-brand-cream/50"><td className="whitespace-nowrap px-4 py-3 font-mono text-xs font-semibold text-brand-gold"><Link href={`/admin/members/${encodeURIComponent(member.member_id as string)}`} className="hover:underline">{member.member_id as string}</Link></td><td className="whitespace-nowrap px-4 py-3 text-sm text-brand-black">{member.first_name as string} {member.last_name as string}</td><td className="px-4 py-3 text-sm text-brand-grey">{member.email as string}</td><td className="max-w-52 truncate px-4 py-3 text-sm text-brand-grey" title={member.university as string}>{member.university as string}</td><td className="whitespace-nowrap px-4 py-3 text-sm text-brand-grey">{member.study_level as string}</td><td className="whitespace-nowrap px-4 py-3 text-sm text-brand-grey">{member.state_of_origin as string}</td><td className="px-4 py-3"><span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${member.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{member.status as string}</span></td><td className="whitespace-nowrap px-4 py-3 text-sm text-brand-grey">{new Date(member.joined_at as string).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' })}</td></tr>)}
    </tbody></table></div>
    {totalPages > 1 && <nav aria-label="Member pages" className="flex items-center justify-between border-t border-brand-card px-4 py-3"><span className="text-xs text-brand-grey">Page {page} of {totalPages}</span><div className="flex gap-2">{page > 1 && <Link href={linkFor(page - 1)} className="rounded-lg border border-brand-card px-3 py-1.5 text-xs hover:bg-brand-cream">Previous</Link>}{page < totalPages && <Link href={linkFor(page + 1)} className="rounded-lg border border-brand-card px-3 py-1.5 text-xs hover:bg-brand-cream">Next</Link>}</div></nav>}
    </div>
  </div>
}
