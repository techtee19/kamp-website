'use client'

import { useState } from 'react'

export default function SendRequestAdminNotification({ requestId }: { requestId: number }) {
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [failed, setFailed] = useState(false)

  async function send() {
    setBusy(true)
    setMessage('')
    setFailed(false)
    try {
      const response = await fetch(`/admin/api/requests/${requestId}/notify`, { method: 'POST' })
      const result = await response.json().catch(() => null)
      if (!response.ok) throw new Error(result?.error ?? 'Could not send the notification.')
      setMessage(`Notification sent to ${result.sent} admin email${result.sent === 1 ? '' : 's'}.`)
    } catch (error) {
      setFailed(true)
      setMessage(error instanceof Error ? error.message : 'Could not send the notification.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="rounded-2xl border border-black/[.06] bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold">Admin notification</h2>
          <p className="mt-1 text-sm text-black/55">Send this request to the configured admin notification emails.</p>
        </div>
        <button type="button" onClick={send} disabled={busy} className="rounded-full bg-brand-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-black/85 disabled:cursor-wait disabled:opacity-60">
          {busy ? 'Sending…' : message && !failed ? 'Send again' : 'Send notification'}
        </button>
      </div>
      {message && <p role={failed ? 'alert' : 'status'} className={`mt-3 text-sm ${failed ? 'text-red-700' : 'text-green-700'}`}>{message}</p>}
    </section>
  )
}
