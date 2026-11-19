'use client'

import { useRef, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, LoaderCircle } from 'lucide-react'

export default function SupportWelcomeAction({ requestId, memberId, registeredEmail, confirmOwnership }: {
  requestId: string
  memberId: string
  registeredEmail: string
  confirmOwnership: boolean
}) {
  const router = useRouter()
  const sending = useRef(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [failed, setFailed] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (sending.current) return
    const form = new FormData(event.currentTarget)
    sending.current = true
    setBusy(true)
    setMessage('')
    setFailed(false)
    try {
      const response = await fetch('/admin/api/members/support', {
        method: 'POST', headers: { Accept: 'application/json' }, body: form,
      })
      const result = await response.json().catch(() => null)
      if (!response.ok) throw new Error(result?.error ?? 'Could not queue the member email. Please try again.')
      setMessage('Member ID and welcome email queued. Keep this request open until the member confirms receipt.')
      router.refresh()
    } catch (error) {
      setFailed(true)
      setMessage(error instanceof Error ? error.message : 'Connection lost. Refresh the delivery status before trying again.')
    } finally {
      sending.current = false
      setBusy(false)
    }
  }

  return <form onSubmit={submit} className="space-y-3">
    <input type="hidden" name="action" value="send_welcome" />
    <input type="hidden" name="id" value={requestId} />
    <input type="hidden" name="memberId" value={memberId} />
    {confirmOwnership && <label className="flex items-start gap-2.5 text-sm leading-6 text-brand-grey">
      <input name="ownershipVerified" type="checkbox" required className="mt-1 size-4 accent-brand-ink" />
      I verified that this record belongs to the requester.
    </label>}
    <button disabled={busy} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand-ink px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-black disabled:opacity-60">
      {busy ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin motion-reduce:animate-none" /> : <Mail aria-hidden="true" className="size-4" />}
      {busy ? 'Queueing email…' : 'Send member ID & welcome email'}
    </button>
    <p className="break-all text-xs leading-5 text-brand-grey">Sends to {registeredEmail}</p>
    {message && <p role={failed ? 'alert' : 'status'} className={`rounded-xl px-4 py-3 text-sm leading-6 ${failed ? 'bg-red-50 text-red-800' : 'bg-emerald-50 text-emerald-800'}`}>{message}</p>}
  </form>
}
