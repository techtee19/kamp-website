'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CheckinLogoutButton({ eventSlug }: { eventSlug: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  async function logout() {
    setBusy(true)
    await fetch('/api/check-in/logout', { method: 'POST' })
    router.replace(`/check-in/login?event=${encodeURIComponent(eventSlug)}`)
    router.refresh()
  }
  return <button type="button" onClick={() => void logout()} disabled={busy} className="min-h-10 rounded-full border border-brand-card bg-white px-4 text-sm font-semibold text-brand-ink disabled:opacity-60">{busy ? 'Signing out…' : 'Sign out'}</button>
}
