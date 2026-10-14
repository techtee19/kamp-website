'use client'

import { useEffect, useState } from 'react'
import MembershipForm from '@/components/membership/MembershipForm'

type Invitation = { token: string; email: string; role: string }

export default function LeadershipInviteRegistration() {
  const [invitation, setInvitation] = useState<Invitation | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = window.location.hash.slice(1)
    if (!/^[A-Za-z0-9_-]{43}$/.test(token)) {
      setError('This invitation link is incomplete. Please open the full link KAMP sent you.')
      setLoading(false)
      return
    }

    let cancelled = false
    fetch('/api/membership/invite/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    }).then(async (response) => {
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? 'This invitation could not be verified.')
      if (!cancelled) setInvitation({ token, ...result })
    }).catch((cause: unknown) => {
      if (!cancelled) setError(cause instanceof Error ? cause.message : 'We could not verify this invitation. Please try again.')
    }).finally(() => {
      if (!cancelled) setLoading(false)
    })
    return () => { cancelled = true }
  }, [])

  if (loading) return <div role="status" className="rounded-2xl border border-brand-card bg-white p-7 text-sm text-brand-grey">Verifying your private KAMP invitation…</div>
  if (error || !invitation) return <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm leading-relaxed text-red-800">{error || 'This invitation could not be verified.'} Contact KAMP if you need a fresh invitation.</div>

  return <div>
    <div className="mb-6 rounded-2xl border border-brand-gold/30 bg-brand-cream p-5">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-ink/60">Leadership invitation</p>
      <h2 className="mt-2 font-display text-xl font-semibold text-brand-ink">Complete your {invitation.role} registration</h2>
      <p className="mt-2 text-sm leading-relaxed text-brand-grey">Your approved leadership role is attached to this invitation. Your role-specific KAMP ID will be assigned when you complete registration.</p>
    </div>
    <MembershipForm leadershipInvite={invitation} />
  </div>
}
