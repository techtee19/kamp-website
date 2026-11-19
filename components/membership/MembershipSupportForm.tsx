'use client'

import { useState, type FormEvent } from 'react'

export default function MembershipSupportForm({ initialIssue = 'membership' }: { initialIssue?: 'membership' | 'whatsapp' }) {
  const [issueType, setIssueType] = useState(initialIssue)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [done, setDone] = useState(false)
  const input = 'mt-2 w-full rounded-lg border border-brand-ink/20 bg-white px-4 py-3'

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    setBusy(true)
    setMessage('')
    const data = Object.fromEntries(new FormData(event.currentTarget))
    try {
      const response = await fetch('/api/membership/support', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error)
      setMessage(result.message)
      setDone(true)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not send your request. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  if (done) return <p role="status" className="mt-8 rounded-xl bg-green-50 p-5 text-green-800">{message}</p>
  return <form onSubmit={submit} className="mt-8 grid gap-5 rounded-2xl bg-brand-card p-6">
    <label className="text-sm font-semibold">What do you need help with?
      <select name="issueType" value={issueType} onChange={(event) => setIssueType(event.target.value as 'membership' | 'whatsapp')} className={input}>
        <option value="membership">Member ID, email, or registration</option>
        <option value="whatsapp">I can’t join the WhatsApp community</option>
      </select>
    </label>
    <label className="text-sm font-semibold">Email we can reply to<input required type="email" name="email" maxLength={254} className={input} /></label>
    <label className="text-sm font-semibold">KAMP member ID (if known)<input name="memberId" maxLength={64} className={input} /></label>
    {issueType === 'whatsapp' && <label className="text-sm font-semibold">Your WhatsApp number
      <input required type="tel" inputMode="tel" autoComplete="tel" name="whatsappNumber" maxLength={32} placeholder="08012345678 or +2348012345678" className={input} />
      <span className="mt-2 block text-xs font-normal leading-5 text-brand-grey">Use the number linked to your WhatsApp account. Include the country code for numbers outside Nigeria. KAMP will use it to add you to the community manually.</span>
    </label>}
    <label className="text-sm font-semibold">{issueType === 'whatsapp' ? 'Anything else we should know? (optional)' : 'How can we help?'}
      <textarea required={issueType === 'membership'} name="message" minLength={issueType === 'membership' ? 10 : undefined} maxLength={1000} rows={4} className={input} />
    </label>
    <p className="text-xs text-brand-grey">Keep your verification codes and passwords private.</p>
    {message && <p role="alert" className="text-sm text-red-700">{message}</p>}
    <button disabled={busy} className="w-fit rounded-full bg-brand-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{busy ? 'Sending…' : issueType === 'whatsapp' ? 'Request help joining WhatsApp' : 'Send support request'}</button>
  </form>
}
