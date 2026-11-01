'use client'

import { useMemo, useState } from 'react'
import type { UniversityCount } from '@/lib/admin-analytics'

export default function UniversityDirectory({ data }: { data: UniversityCount[] }) {
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase()
    return normalized ? data.filter((item) => item.fullName.toLocaleLowerCase().includes(normalized)) : data
  }, [data, query])

  return <div>
    <label htmlFor="university-search" className="sr-only">Search universities</label>
    <input
      id="university-search"
      type="search"
      value={query}
      onChange={(event) => setQuery(event.target.value)}
      placeholder="Search universities…"
      className="mb-3 min-h-11 w-full rounded-xl border border-brand-card bg-brand-cream px-4 py-2.5 text-sm text-brand-black outline-none placeholder:text-brand-grey focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 sm:max-w-sm"
    />
    <p aria-live="polite" className="mb-2 text-xs text-brand-grey">Showing {filtered.length.toLocaleString()} of {data.length.toLocaleString()} institutions</p>
    <div className="max-h-[28rem] overflow-auto rounded-xl border border-brand-card">
      <table className="w-full text-left">
        <thead className="sticky top-0 z-10 bg-brand-cream text-xs uppercase tracking-wider text-brand-grey">
          <tr><th scope="col" className="px-4 py-3 font-semibold">University / institution</th><th scope="col" className="w-32 px-4 py-3 text-right font-semibold">Members</th></tr>
        </thead>
        <tbody>
          {filtered.length === 0
            ? <tr><td colSpan={2} className="px-4 py-10 text-center text-sm text-brand-grey">{data.length ? 'No universities match your search.' : 'No student members have registered with an institution yet.'}</td></tr>
            : filtered.map((item) => <tr key={item.fullName.toLocaleLowerCase()} className="border-t border-brand-card first:border-0 hover:bg-brand-cream/40"><th scope="row" className="px-4 py-3 text-sm font-medium text-brand-black">{item.fullName}</th><td className="px-4 py-3 text-right font-mono text-sm font-semibold tabular-nums text-brand-ink">{item.count.toLocaleString()}</td></tr>)}
        </tbody>
      </table>
    </div>
  </div>
}
