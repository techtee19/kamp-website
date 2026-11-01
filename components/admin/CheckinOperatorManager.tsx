'use client'

import { useEffect, useState } from 'react'

type Operator = { id: number; email: string; enabled: boolean; created_at: string }

export default function CheckinOperatorManager({ eventSlug }: { eventSlug: string }) {
  const [operators, setOperators] = useState<Operator[]>([])
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function load() {
    const response = await fetch(`/admin/api/events/checkin/operators?eventSlug=${encodeURIComponent(eventSlug)}`, { cache: 'no-store' })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Could not load the check-in team.')
    setOperators((data.operators as Operator[]).map((operator) => ({ ...operator, id: Number(operator.id) })))
  }

  useEffect(() => { void load().catch((cause) => setError(cause instanceof Error ? cause.message : 'Could not load the check-in team.')) }, [eventSlug])

  async function addOperator(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true); setError(''); setMessage('')
    try {
      const response = await fetch('/admin/api/events/checkin/operators', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ eventSlug, email }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Could not add the check-in operator.')
      setEmail(''); setMessage(`Access invitation sent to ${data.email}.`); await load()
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not add the check-in operator.') }
    finally { setBusy(false) }
  }

  async function revoke(operator: Operator) {
    setBusy(true); setError(''); setMessage('')
    try {
      const response = await fetch('/admin/api/events/checkin/operators', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ eventSlug, operatorId: operator.id }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Could not revoke access.')
      setMessage(`Access revoked for ${operator.email}.`); await load()
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not revoke access.') }
    finally { setBusy(false) }
  }

  return <section className="mb-6 rounded-xl border border-brand-card bg-white p-5 sm:p-6">
    <h2 className="font-display text-lg font-bold text-brand-black">Check-in team</h2>
    <p className="mt-1 max-w-2xl text-sm leading-6 text-brand-grey">Give registration volunteers individual access to this event only. They sign in by email code and cannot open the admin dashboard or undo check-ins.</p>
    <form onSubmit={addOperator} className="mt-4 flex flex-col gap-3 sm:flex-row">
      <label className="sr-only" htmlFor="checkin-operator-email">Operator email</label>
      <input id="checkin-operator-email" type="email" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} placeholder="volunteer@example.com" className="min-h-11 min-w-0 flex-1 rounded-lg border border-brand-card px-4 text-sm outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold" />
      <button type="submit" disabled={busy} className="min-h-11 rounded-full bg-brand-black px-5 text-sm font-semibold text-white disabled:opacity-60">{busy ? 'Please wait…' : 'Add and send invite'}</button>
    </form>
    {message && <p role="status" className="mt-3 text-sm text-green-800">{message}</p>}{error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
    <ul className="mt-4 divide-y divide-brand-card">
      {operators.map((operator) => <li key={operator.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm"><span className="min-w-0"><span className="block truncate font-medium text-brand-black">{operator.email}</span><span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs ${operator.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>{operator.enabled ? 'Active' : 'Revoked'}</span></span>{operator.enabled && <button type="button" disabled={busy} onClick={() => void revoke(operator)} className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 disabled:opacity-50">Revoke</button>}</li>)}
      {operators.length === 0 && !error && <li className="py-3 text-sm text-brand-grey">No operators have access yet.</li>}
    </ul>
  </section>
}
