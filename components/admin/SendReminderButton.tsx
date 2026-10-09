'use client'

import { useState } from 'react'

export default function SendReminderButton({ eventSlug, registrantCount }: { eventSlug: string; registrantCount: number }) {
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)

  async function send() {
    setBusy(true)
    setMessage('')
    setError(false)
    try {
      const response = await fetch('/admin/api/events/remind', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventSlug }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Could not send reminders.')
      setMessage(data.message)
      if (data.failed > 0) setError(true)
      setOpen(false)
    } catch (cause) {
      setError(true)
      setMessage(cause instanceof Error ? cause.message : 'Network error. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return <div>
    <button type="button" onClick={() => { setMessage(''); setOpen(true) }} disabled={busy || registrantCount === 0} className="rounded-full bg-brand-gold px-5 py-2 text-sm font-semibold text-brand-black transition hover:bg-brand-gold/90 disabled:cursor-not-allowed disabled:opacity-50">Send Reminder Email</button>
    {message && <p role={error ? 'alert' : 'status'} className={`mt-2 max-w-sm text-xs ${error ? 'text-red-600' : 'text-green-700'}`}>{message}</p>}
    {open && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="presentation"><section role="alertdialog" aria-modal="true" aria-labelledby="reminder-title" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
      <h2 id="reminder-title" className="font-display text-xl font-bold text-brand-black">Send event reminders?</h2>
      <p className="mt-3 text-sm text-brand-grey">This sends a reminder to {registrantCount} confirmed registrant{registrantCount === 1 ? '' : 's'}. Check the event details before sending.</p>
      <div className="mt-6 flex gap-3"><button type="button" onClick={() => setOpen(false)} disabled={busy} className="flex-1 rounded-full border border-brand-card py-2.5 text-sm disabled:opacity-50">Cancel</button><button type="button" onClick={() => void send()} disabled={busy || registrantCount === 0} className="flex-1 rounded-full bg-brand-gold py-2.5 text-sm font-semibold text-brand-black disabled:opacity-50">{busy ? 'Sending…' : 'Send to all'}</button></div>
    </section></div>}
  </div>
}
