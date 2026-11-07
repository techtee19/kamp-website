'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

type Props = { kind: 'leader' | 'report' | 'request'; id: number; label: string }

export default function DeleteLeaderPortalDataButton({ kind, id, label }: Props) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const descriptions = {
    leader: `Permanently remove ${label}'s Leaders Portal account and all reports and requests submitted through it? This does not delete a KAMP membership record.`,
    report: `Permanently delete the report “${label}”?`,
    request: `Permanently delete the support request “${label}”?`,
  }

  async function remove() {
    if (!window.confirm(descriptions[kind])) return
    setBusy(true); setError('')
    try {
      const response = await fetch(`/admin/api/${kind === 'leader' ? 'leaders' : `${kind}s`}/${id}`, { method: 'DELETE' })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Could not delete this record.')
      router.refresh()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not delete this record.')
    } finally { setBusy(false) }
  }

  return <span className="inline-flex flex-col items-start gap-1">
    <button type="button" onClick={remove} disabled={busy} aria-label={`Delete ${kind}: ${label}`} className="inline-flex items-center gap-1.5 rounded-full border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:border-red-300 hover:bg-red-50 active:scale-[.98] disabled:opacity-50 motion-reduce:transition-none"><Trash2 size={13} aria-hidden="true" />{busy ? 'Deleting…' : 'Delete'}</button>
    {error && <span role="alert" className="max-w-48 text-xs text-red-700">{error}</span>}
  </span>
}
