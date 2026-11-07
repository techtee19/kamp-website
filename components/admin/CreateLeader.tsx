'use client'
import { useState } from 'react'

export default function CreateLeader() {
  const [busy, setBusy] = useState(false); const [message, setMessage] = useState(''); const [error, setError] = useState('')
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage(''); setError('')
    const formElement = event.currentTarget
    const form = new FormData(formElement)
    try {
      const response = await fetch('/admin/api/leaders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(form)) })
      const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Could not create leader.')
      setMessage(data.message); formElement.reset()
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Could not create leader.') }
    finally { setBusy(false) }
  }
  const field = 'mt-1.5 h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/15'
  return <form onSubmit={submit} className="rounded-2xl border border-black/[.06] bg-white p-5 sm:p-6"><h2 className="font-semibold">Invite a campus leader or executive</h2><p className="mt-1 text-sm text-black/50">They’ll receive the private portal sign-in instructions at this email.</p><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5"><label className="text-sm">Full name<input name="fullName" required maxLength={200} className={field}/></label><label className="text-sm">Email<input type="email" name="email" required maxLength={254} className={field}/></label><label className="text-sm">Campus / team<input name="campus" required maxLength={200} className={field}/></label><label className="text-sm">Role<select name="role" className={field}><option value="campus_leader">Campus leader</option><option value="executive">Executive</option></select></label><label className="text-sm">Phone (optional)<input name="phone" maxLength={24} className={field}/></label></div>{message && <p role="status" className="mt-4 text-sm text-emerald-700">{message}</p>}{error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}<button disabled={busy} className="mt-5 rounded-full bg-brand-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/80 disabled:opacity-60">{busy ? 'Adding leader…' : 'Add leader'}</button></form>
}
