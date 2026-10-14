'use client'

import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'
import { LEADERSHIP_ROLES, type LeadershipRole } from '@/lib/leadership'

type CreatedInvite = { email: string; role: string; invitationUrl: string; expiresAt: string }

export default function CreateLeadershipInvite() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<LeadershipRole>('board_member')
  const [invite, setInvite] = useState<CreatedInvite | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)

  async function createInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setMessage('')
    setError(false)
    setInvite(null)
    try {
      const response = await fetch('/admin/api/leadership-invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? 'Could not create this invitation.')
      setInvite(result)
      setMessage('Invitation created. Share the private link with the approved member; their ID is assigned after registration.')
      setEmail('')
      setCopied(false)
      router.refresh()
    } catch (cause) {
      setError(true)
      setMessage(cause instanceof Error ? cause.message : 'Network error. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  async function copyInvite() {
    if (!invite) return
    try {
      await navigator.clipboard.writeText(invite.invitationUrl)
      setCopied(true)
    } catch {
      setError(true)
      setMessage('Clipboard access was blocked. Select and copy the invitation link manually.')
    }
  }

  return <section className="rounded-2xl border border-brand-card bg-white p-5 shadow-[0_1px_2px_rgba(32,32,32,0.03)] sm:p-6">
    <h2 className="font-semibold text-brand-black">Create a leadership invitation</h2>
    <p className="mt-1 max-w-2xl text-sm leading-relaxed text-brand-grey">Invitations expire after 14 days and can only be used once. If the same email and role already have a pending invitation, creating another refreshes its link and invalidates the old one.</p>
    <form onSubmit={createInvite} className="mt-5 grid gap-4 sm:grid-cols-[1fr_220px_auto] sm:items-end">
      <label className="block text-sm font-medium text-brand-black">Leader’s email
        <input required type="email" maxLength={254} autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 min-h-11 w-full rounded-xl border border-brand-card px-3.5 py-2.5 text-sm outline-none focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/15" />
      </label>
      <label className="block text-sm font-medium text-brand-black">Approved role
        <select value={role} onChange={(event) => setRole(event.target.value as LeadershipRole)} className="mt-1.5 min-h-11 w-full rounded-xl border border-brand-card bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/15">
          {Object.entries(LEADERSHIP_ROLES).map(([key, value]) => <option key={key} value={key}>{value.label}{value.maximum > 1 ? ` (up to ${value.maximum})` : ''}</option>)}
        </select>
      </label>
      <button type="submit" disabled={busy} className="min-h-11 rounded-full bg-brand-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-black/80 disabled:cursor-wait disabled:opacity-50">{busy ? 'Creating…' : 'Create invitation'}</button>
    </form>
    {message && <p role={error ? 'alert' : 'status'} className={`mt-4 text-sm ${error ? 'text-red-700' : 'text-green-700'}`}>{message}</p>}
    {invite && <div className="mt-4 rounded-xl border border-brand-gold/30 bg-brand-cream p-4">
      <p className="text-sm font-semibold text-brand-ink">{invite.role} · {invite.email}</p>
      <p className="mt-1 break-all font-mono text-xs text-brand-grey">{invite.invitationUrl}</p>
      <div className="mt-3 flex flex-wrap items-center gap-3"><button type="button" onClick={copyInvite} className="rounded-full bg-brand-black px-4 py-2 text-xs font-semibold text-white">{copied ? 'Copied' : 'Copy private link'}</button><span className="text-xs text-brand-grey">Expires {new Date(invite.expiresAt).toLocaleDateString('en-NG', { dateStyle: 'medium', timeZone: 'Africa/Lagos' })}</span></div>
    </div>}
  </section>
}
