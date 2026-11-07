'use client'

import { useState } from 'react'

export default function PortalLoginForm() {
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(''); setMessage('')
    try {
      const response = await fetch('/leaders/api/request-link', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Could not send the link.')
      setMessage(result.message)
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Could not send the link.') }
    finally { setBusy(false) }
  }

  return <form onSubmit={submit} className="space-y-5">
    <label className="block text-sm font-medium">Work or campus email<input autoComplete="email" required type="email" maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-black/10 bg-white px-4 outline-none transition focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/15" /></label>
    {message && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}
    {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <button disabled={busy} className="w-full rounded-full bg-brand-black px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-black/80 active:scale-[.99] disabled:cursor-wait disabled:opacity-60 motion-reduce:transition-none">{busy ? 'Sending secure link…' : 'Email me a sign-in link'}</button>
  </form>
}
