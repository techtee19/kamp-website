'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CheckinLoginForm({ eventSlug, eventTitle }: { eventSlug: string; eventTitle: string }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [codeRequested, setCodeRequested] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function requestCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError('')
    setMessage('')
    try {
      const response = await fetch('/api/check-in/request-code', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventSlug, email }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Could not request a code.')
      setCodeRequested(true)
      setMessage(result.message)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not request a code.')
    } finally {
      setBusy(false)
    }
  }

  async function verifyCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const response = await fetch('/api/check-in/verify', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventSlug, email, code }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Could not verify this code.')
      router.replace(result.redirectTo)
      router.refresh()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not verify this code.')
    } finally {
      setBusy(false)
    }
  }

  const inputClass = 'mt-2 min-h-12 w-full rounded-xl border border-brand-ink/15 bg-white px-4 py-3 text-brand-black outline-none focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/15'

  return <section className="w-full max-w-md rounded-2xl border border-brand-card bg-white p-6 shadow-sm sm:p-8">
    <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">Registration team</p>
    <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-brand-black">Event check-in</h1>
    <p className="mt-2 text-sm leading-relaxed text-brand-grey">{eventTitle}</p>
    <p className="mt-4 rounded-xl bg-brand-cream p-4 text-sm leading-relaxed text-brand-grey">Sign in with the email address the event admin added. This account only provides access to this event’s check-in.</p>

    {!codeRequested ? <form onSubmit={requestCode} className="mt-6 space-y-4">
      <label className="block text-sm font-medium text-brand-black">Team email<input type="email" autoComplete="email" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} className={inputClass} /></label>
      <button type="submit" disabled={busy} className="min-h-12 w-full rounded-full bg-brand-black px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{busy ? 'Sending code…' : 'Email me a sign-in code'}</button>
    </form> : <form onSubmit={verifyCode} className="mt-6 space-y-4">
      <p className="text-sm text-brand-grey">Enter the six-digit code sent to <strong className="text-brand-black">{email}</strong>.</p>
      <label className="block text-sm font-medium text-brand-black">One-time code<input inputMode="numeric" autoComplete="one-time-code" required minLength={6} maxLength={6} pattern="[0-9]{6}" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} className={`${inputClass} text-center font-mono text-xl tracking-[0.35em]`} /></label>
      <button type="submit" disabled={busy || code.length !== 6} className="min-h-12 w-full rounded-full bg-brand-black px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{busy ? 'Verifying…' : 'Continue to check-in'}</button>
      <button type="button" disabled={busy} onClick={() => { setCodeRequested(false); setCode(''); setMessage('') }} className="w-full py-2 text-sm font-semibold text-brand-ink hover:underline">Use a different email</button>
    </form>}
    {message && <p role="status" className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}
    {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
  </section>
}
