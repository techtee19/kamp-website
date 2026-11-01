'use client'

import { useCallback, useState } from 'react'
import CameraTicketScanner from '@/components/admin/CameraTicketScanner'

interface Registrant {
  id: number
  fullName: string
  email: string
  attendeeType: string
  university: string
  studyLevel: string
  occupation: string
  organization: string
  memberId: string
  ticketRef: string
  checkedIn: boolean
}

export default function CheckinList({ registrations, eventSlug, operatorOnly = false }: { registrations: Registrant[]; eventSlug: string; operatorOnly?: boolean }) {
  const [list, setList] = useState(registrations)
  const [query, setQuery] = useState('')
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [scannerOpen, setScannerOpen] = useState(false)
  const [scanBusy, setScanBusy] = useState(false)
  const [scanNotice, setScanNotice] = useState('')
  const normalized = query.trim().toLocaleLowerCase()
  const filtered = normalized ? list.filter((person) => [person.fullName, ...(operatorOnly ? [] : [person.email]), person.ticketRef, person.memberId, person.attendeeType, person.occupation, person.organization].some((value) => value.toLocaleLowerCase().includes(normalized))) : list
  const checkedInCount = list.filter((person) => person.checkedIn).length

  const handleScannedTicket = useCallback(async (ticketRef: string) => {
    setScannerOpen(false)
    setScanBusy(true)
    setError('')
    setScanNotice('')
    try {
      const response = await fetch('/admin/api/events/checkin/scan', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventSlug, ticketRef: ticketRef.trim() }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Could not verify this ticket.')
      const attendee = data.attendee as { id: number; full_name: string; ticket_ref: string }
      setList((previous) => previous.map((person) => person.id === Number(attendee.id) ? { ...person, checkedIn: true } : person))
      setScanNotice(data.alreadyCheckedIn
        ? `${attendee.full_name} is already checked in (${attendee.ticket_ref}).`
        : `${attendee.full_name} checked in successfully (${attendee.ticket_ref}).`)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not verify this ticket. Please try again.')
    } finally {
      setScanBusy(false)
    }
  }, [eventSlug])

  async function toggle(person: Registrant) {
    if (loadingId !== null || (operatorOnly && person.checkedIn)) return
    const nextValue = operatorOnly || !person.checkedIn
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
    <input id="checkin-search" value={query} onChange={(event) => setQuery(event.target.value)} type="search" maxLength={120} placeholder={operatorOnly ? 'Search by name, member ID, or ticket reference…' : 'Search by name, email, or ticket reference…'} className="mb-3 w-full rounded-lg border border-brand-card bg-white px-4 py-3 text-sm outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold" />
    <p aria-live="polite" className="mb-3 text-sm text-brand-grey">{checkedInCount} of {list.length} checked in{normalized ? ` · showing ${filtered.length}` : ''}</p>
    {error && <p role="alert" className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {scanNotice && <p role="status" className="mb-3 rounded-lg bg-green-50 p-3 text-sm font-medium text-green-800">{scanNotice}</p>}
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <button type="button" onClick={() => { setError(''); setScanNotice(''); setScannerOpen((open) => !open) }} disabled={scanBusy} className="min-h-11 rounded-full bg-brand-gold px-5 py-2.5 text-sm font-semibold text-brand-black disabled:opacity-60">{scannerOpen ? 'Close camera scanner' : 'Scan ticket QR'}</button>
      {scanBusy && <span role="status" className="text-sm text-brand-grey">Checking ticket…</span>}
    </div>
    {scannerOpen && <CameraTicketScanner onTicket={handleScannedTicket} onClose={() => setScannerOpen(false)} />}
    <div className="space-y-2">{filtered.length === 0 ? <p className="py-10 text-center text-sm text-brand-grey">No attendees found.</p> : filtered.map((person) => <button type="button" key={person.id} onClick={() => void toggle(person)} disabled={loadingId !== null || (operatorOnly && person.checkedIn)} aria-pressed={person.checkedIn} aria-label={`${person.fullName}, ${person.checkedIn ? 'already checked in' : 'mark as checked in'}`} className={`flex min-h-20 w-full items-center gap-4 rounded-xl border p-4 text-left transition disabled:cursor-wait disabled:opacity-70 ${person.checkedIn ? 'border-green-200 bg-green-50' : 'border-brand-card bg-white hover:border-brand-gold'}`}>
      <span aria-hidden="true" className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg font-bold ${person.checkedIn ? 'bg-green-600 text-white' : 'border-2 border-brand-grey/40 text-transparent'}`}>{person.checkedIn ? '✓' : '·'}</span>
      <span className="min-w-0 flex-1"><span className={`block truncate text-sm font-semibold ${person.checkedIn ? 'text-green-800' : 'text-brand-black'}`}>{person.fullName}</span><span className="mt-1 block truncate text-xs capitalize text-brand-grey">{person.attendeeType.replace('_', ' ')}{person.memberId ? ` · ${person.memberId}` : ''}</span><span className="mt-1 block truncate text-xs text-brand-grey">{[person.university, person.studyLevel, person.occupation, person.organization].filter(Boolean).join(' · ')}</span></span>
      <span className="hidden shrink-0 font-mono text-xs text-brand-gold sm:block">{person.ticketRef || '—'}</span>
      <span className="sr-only">{person.checkedIn ? 'Checked in' : 'Not checked in'}</span>
    </button>)}</div>
  </section>
}
