'use client'

import { useState } from 'react'

type Counts = { total: number; pending: number; sending: number; sent: number; failed: number }

async function postAction(action: 'start' | 'send-batch' | 'retry-failed') {
  const response = await fetch('/admin/api/members/community-campaign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action }),
  })
  const result = await response.json()
  if (!response.ok) throw new Error(result.error ?? 'The email campaign could not run.')
  return result as { counts: Counts; batchSent?: number; batchFailed?: number }
}

export default function CommunityEmailCampaign() {
  const [counts, setCounts] = useState<Counts | null>(null)
  const [busy, setBusy] = useState(false)
  const [prepared, setPrepared] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  async function prepare() {
    setBusy(true)
    setError('')
    setNotice('')
    try {
      const result = await postAction('start')
      setCounts(result.counts)
      setPrepared(true)
      setNotice(`Campaign prepared for ${result.counts.total.toLocaleString()} registered members.`)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not prepare the email campaign.')
    } finally {
      setBusy(false)
    }
  }

  async function send(retry = false) {
    setBusy(true)
    setError('')
    setNotice('Sending in small batches. Keep this page open until it finishes.')
    try {
      let result = retry ? await postAction('retry-failed') : null
      if (result) setCounts(result.counts)
      result = await postAction('start')
      setCounts(result.counts)
      while (result.counts.pending > 0) {
        result = await postAction('send-batch')
        setCounts(result.counts)
      }
      setNotice(`Finished: ${result.counts.sent.toLocaleString()} sent, ${result.counts.failed.toLocaleString()} failed.`)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'The email campaign stopped unexpectedly.')
    } finally {
      setBusy(false)
    }
  }

  return <section className="rounded-2xl border border-brand-card bg-white p-5 sm:p-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="max-w-3xl"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-gold">Member outreach</p><h2 className="mt-2 font-display text-xl font-bold text-brand-black">Invite members to the WhatsApp community</h2><p className="mt-2 text-sm leading-relaxed text-brand-grey">Send a separate email to every registered member with a fresh tracked join link. The campaign can resume safely without resending emails already marked sent.</p></div>
      {!prepared ? <button type="button" onClick={prepare} disabled={busy} className="min-h-11 rounded-full bg-brand-ink px-5 text-sm font-semibold text-white hover:bg-brand-black disabled:opacity-60">{busy ? 'Preparing…' : 'Prepare campaign'}</button> : <div className="flex flex-wrap gap-2"><button type="button" onClick={() => send()} disabled={busy || !counts?.pending} className="min-h-11 rounded-full bg-brand-ink px-5 text-sm font-semibold text-white hover:bg-brand-black disabled:opacity-50">{busy ? 'Sending…' : counts?.pending ? 'Send to all members' : 'Campaign complete'}</button>{!busy && Boolean(counts?.failed) && <button type="button" onClick={() => send(true)} className="min-h-11 rounded-full border border-brand-card px-5 text-sm font-semibold text-brand-ink hover:bg-brand-cream">Retry failed ({counts?.failed})</button>}</div>}
    </div>
    {prepared && counts && <div className="mt-5 grid grid-cols-2 gap-2 text-sm sm:grid-cols-5">{([['Total', counts.total], ['Pending', counts.pending], ['Sending', counts.sending], ['Sent', counts.sent], ['Failed', counts.failed]] as const).map(([label, value]) => <div key={label} className="rounded-xl bg-brand-cream px-3 py-2"><span className="text-xs text-brand-grey">{label}</span><p className="font-semibold text-brand-ink">{value.toLocaleString()}</p></div>)}</div>}
    {notice && <p role="status" className="mt-4 text-sm text-brand-grey">{notice}</p>}
    {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
  </section>
}
