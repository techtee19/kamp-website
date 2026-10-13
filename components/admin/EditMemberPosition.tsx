'use client'

import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'

export default function EditMemberPosition({ memberId, currentPosition }: { memberId: string; currentPosition: string }) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [position, setPosition] = useState(currentPosition)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)

  async function savePosition(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setMessage('')
    setError(false)
    try {
      const response = await fetch(`/admin/api/members/${encodeURIComponent(memberId)}/position`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kampPosition: position }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Could not update the position.')
      setPosition(data.kampPosition)
      setEditing(false)
      setMessage('Position updated. Resend the ID card below to email the corrected card to this member.')
      router.refresh()
    } catch (cause) {
      setError(true)
      setMessage(cause instanceof Error ? cause.message : 'Network error. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return <div className="border-b border-brand-card bg-brand-cream/40 px-6 py-4">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><p className="mb-1 text-xs uppercase tracking-widest text-brand-grey">KAMP position</p><p className="text-sm font-semibold text-brand-black">{position}</p></div>
      {!editing && <button type="button" onClick={() => { setEditing(true); setMessage('') }} className="rounded-full border border-brand-card bg-white px-4 py-2 text-sm font-semibold text-brand-ink transition hover:bg-brand-cream">Edit position</button>}
    </div>
    {editing && <form onSubmit={savePosition} className="mt-4 flex flex-wrap items-end gap-3">
      <label className="min-w-56 flex-1 text-sm font-medium text-brand-black">New KAMP position
        <input autoFocus required minLength={2} maxLength={48} value={position} onChange={(event) => setPosition(event.target.value)} className="mt-1.5 w-full rounded-lg border border-brand-card bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20" />
      </label>
      <button type="submit" disabled={busy} className="rounded-full bg-brand-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-black/80 disabled:opacity-50">{busy ? 'Saving…' : 'Save position'}</button>
      <button type="button" disabled={busy} onClick={() => { setPosition(currentPosition); setEditing(false) }} className="rounded-full border border-brand-card bg-white px-5 py-2.5 text-sm font-semibold text-brand-ink disabled:opacity-50">Cancel</button>
    </form>}
    {message && <p role={error ? 'alert' : 'status'} className={`mt-3 text-xs ${error ? 'text-red-600' : 'text-green-700'}`}>{message}</p>}
  </div>
}
