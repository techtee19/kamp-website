'use client'

import { useState } from 'react'

interface Registrant {
  id: number
  fullName: string
  email: string
  university: string
  studyLevel: string
  ticketRef: string
  checkedIn: boolean
}

export default function CheckinList({ registrations, eventSlug }: { registrations: Registrant[]; eventSlug: string }) {
  const [list, setList] = useState(registrations)
  const [query, setQuery] = useState('')
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [error, setError] = useState('')
  const normalized = query.trim().toLocaleLowerCase()
  const filtered = normalized ? list.filter((person) => [person.fullName, person.email, person.ticketRef].some((value) => value.toLocaleLowerCase().includes(normalized))) : list
  const checkedInCount = list.filter((person) => person.checkedIn).length

  async function toggle(person: Registrant) {
    if (loadingId !== null) return
    const nextValue = !person.checkedIn
    setLoadingId(person.id)
    setError('')
    setList((previous) => previous.map((item) => item.id === person.id ? { ...item, checkedIn: nextValue } : item))
    try {
      const response = await fetch('/admin/api/events/checkin', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationId: person.id, eventSlug, checkedIn: nextValue }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Could not update check-in.')
      setList((previous) => previous.map((item) => item.id === person.id ? { ...item, checkedIn: Boolean(data.checkedIn) } : item))
    } catch (cause) {
      setList((previous) => previous.map((item) => item.id === person.id ? { ...item, checkedIn: person.checkedIn } : item))
      setError(cause instanceof Error ? cause.message : 'Network error. Please try again.')
    } finally {
      setLoadingId(null)
    }
  }

  return <section>
    <div className="mb-4 grid max-w-xl grid-cols-3 gap-2 sm:gap-4">
      {[['Checked in', checkedInCount, 'bg-green-100 text-green-700'], ['Total', list.length, 'bg-white text-brand-black'], ['Remaining', list.length - checkedInCount, 'bg-white text-brand-black']].map(([label, value, color]) => <div key={String(label)} className={`rounded-xl border border-brand-card px-3 py-3 sm:px-4 ${color}`}><p className="text-[10px] font-semibold uppercase tracking-widest sm:text-xs">{label}</p><p className="font-display text-2xl font-bold sm:text-3xl">{value}</p></div>)}
    </div>
    <label htmlFor="checkin-search" className="sr-only">Search attendees</label>
    <input id="checkin-search" value={query} onChange={(event) => setQuery(event.target.value)} type="search" maxLength={120} placeholder="Search by name, email, or ticket reference…" className="mb-3 w-full rounded-lg border border-brand-card bg-white px-4 py-3 text-sm outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold" />
    <p aria-live="polite" className="mb-3 text-sm text-brand-grey">{checkedInCount} of {list.length} checked in{normalized ? ` · showing ${filtered.length}` : ''}</p>
    {error && <p role="alert" className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <div className="space-y-2">{filtered.length === 0 ? <p className="py-10 text-center text-sm text-brand-grey">No attendees found.</p> : filtered.map((person) => <button type="button" key={person.id} onClick={() => void toggle(person)} disabled={loadingId !== null} aria-pressed={person.checkedIn} className={`flex min-h-20 w-full items-center gap-4 rounded-xl border p-4 text-left transition disabled:cursor-wait disabled:opacity-70 ${person.checkedIn ? 'border-green-200 bg-green-50' : 'border-brand-card bg-white hover:border-brand-gold'}`}>
      <span aria-hidden="true" className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg font-bold ${person.checkedIn ? 'bg-green-600 text-white' : 'border-2 border-brand-grey/40 text-transparent'}`}>{person.checkedIn ? '✓' : '·'}</span>
      <span className="min-w-0 flex-1"><span className={`block truncate text-sm font-semibold ${person.checkedIn ? 'text-green-800' : 'text-brand-black'}`}>{person.fullName}</span><span className="mt-1 block truncate text-xs text-brand-grey">{person.email}</span><span className="mt-1 block truncate text-xs text-brand-grey">{person.university} · {person.studyLevel}</span></span>
      <span className="hidden shrink-0 font-mono text-xs text-brand-gold sm:block">{person.ticketRef || '—'}</span>
      <span className="sr-only">{person.checkedIn ? 'Checked in' : 'Not checked in'}</span>
    </button>)}</div>
  </section>
}
