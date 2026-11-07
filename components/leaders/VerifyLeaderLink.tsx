'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function VerifyLeaderLink({ token }: { token: string }) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function verify() {
    setBusy(true); setError('')
    try {
      const response = await fetch('/leaders/api/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'This link could not be verified.')
      router.replace('/leaders/dashboard'); router.refresh()
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'This link could not be verified.'); setBusy(false) }
  }
  return <div className="space-y-4"><p className="text-sm leading-6 text-black/60">For your security, confirm below to use this one-time sign-in link.</p>{error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}<button onClick={verify} disabled={busy || !token} className="w-full rounded-full bg-brand-black px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-black/80 disabled:opacity-60 motion-reduce:transition-none">{busy ? 'Verifying link…' : 'Continue to the portal'}</button></div>
}
