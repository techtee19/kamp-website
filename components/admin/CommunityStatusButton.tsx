'use client'

import { useState } from 'react'

export default function CommunityStatusButton({ memberId, joined }: { memberId: string; joined: boolean }) {
  const [isJoined, setIsJoined] = useState(joined)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function updateStatus() {
    setBusy(true)
    setError('')
    try {
      const response = await fetch('/admin/api/members/community-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId, joined: !isJoined }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? 'Could not update status.')
      setIsJoined(Boolean(result.joined))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Network error. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return <div className="space-y-2">
    <button type="button" onClick={updateStatus} disabled={busy} aria-pressed={isJoined} className={`min-h-9 rounded-full px-3.5 py-2 text-xs font-semibold transition disabled:opacity-60 ${isJoined ? 'border border-brand-card bg-white text-brand-ink hover:bg-brand-cream' : 'bg-brand-ink text-white hover:bg-brand-black/80'}`}>
      {busy ? 'Saving…' : isJoined ? 'Undo joined' : 'Mark joined'}
    </button>
    {error && <p role="alert" className="max-w-40 text-xs text-red-700">{error}</p>}
  </div>
}
