'use client'

import { useState } from 'react'

export default function ResendCardButton({ memberId }: { memberId: string }) {
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)

  async function resend() {
    setBusy(true)
    setMessage('')
    setError(false)
    try {
      const response = await fetch('/admin/api/members/resend-card', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to resend card.')
      setMessage(data.photoAvailable ? 'ID card email sent.' : 'ID card email sent with an initials placeholder; this member registered before passport photos were saved.')
    } catch (cause) {
      setError(true)
      setMessage(cause instanceof Error ? cause.message : 'Network error. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return <div>
    <button type="button" onClick={resend} disabled={busy} className="rounded-full bg-brand-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-black/80 disabled:cursor-not-allowed disabled:opacity-50">{busy ? 'Sending…' : 'Resend ID Card'}</button>
    {message && <p role={error ? 'alert' : 'status'} className={`mt-2 max-w-md text-xs ${error ? 'text-red-600' : 'text-green-700'}`}>{message}</p>}
  </div>
}
