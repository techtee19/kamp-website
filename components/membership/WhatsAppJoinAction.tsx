'use client'

import { useState, useSyncExternalStore } from 'react'
import { ArrowUpRight, LoaderCircle } from 'lucide-react'

function subscribeToHashChange(onChange: () => void) {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

function getHashToken() {
  return window.location.hash.slice(1)
}

function getServerHashToken() {
  return ''
}

export default function WhatsAppJoinAction({ token: initialToken, compact = false }: { token?: string; compact?: boolean }) {
  const hashToken = useSyncExternalStore(subscribeToHashChange, getHashToken, getServerHashToken)
  const token = initialToken ?? hashToken
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function continueToWhatsApp() {
    if (!token) {
      setError('This join link is incomplete. Please use the link from your membership email.')
      return
    }
    setBusy(true)
    setError('')
    try {
      const response = await fetch('/api/community/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      const result = await response.json()
      if (!response.ok || typeof result.url !== 'string') throw new Error(result.error ?? 'Could not open the WhatsApp community link.')
      window.location.assign(result.url)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not open WhatsApp. Please try again.')
      setBusy(false)
    }
  }

  return <div>
    <button type="button" onClick={continueToWhatsApp} disabled={busy || !token} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#176B42] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#115735] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#176B42] disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none ${compact ? 'w-full sm:w-auto' : 'w-full sm:w-auto'}`}>
      {busy ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : <span aria-hidden="true" className="text-lg leading-none">◉</span>}
      {busy ? 'Opening WhatsApp…' : 'Join the KAMP WhatsApp community'}
      {!busy && <ArrowUpRight aria-hidden="true" className="size-4" />}
    </button>
    {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
  </div>
}
