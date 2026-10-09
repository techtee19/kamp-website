'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DeleteMemberButton({ memberId, memberName }: { memberId: string; memberName: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function deleteMember() {
    setBusy(true)
    setError('')
    try {
      const response = await fetch('/admin/api/members/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Could not delete member.')
      router.replace('/admin/members')
      router.refresh()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Network error. Please try again.')
      setBusy(false)
    }
  }

  return <>
    <button type="button" onClick={() => setOpen(true)} className="rounded-full border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50">Delete Member</button>
    {open && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="presentation">
      <section role="alertdialog" aria-modal="true" aria-labelledby="delete-member-title" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 id="delete-member-title" className="font-display text-xl font-bold text-brand-black">Delete this member?</h2>
        <p className="mt-3 text-sm text-brand-grey">This permanently deletes <strong>{memberName}</strong> ({memberId}) from the members database.</p>
        {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={() => { setOpen(false); setError('') }} disabled={busy} className="rounded-full border border-brand-card px-5 py-2.5 text-sm disabled:opacity-50">Cancel</button>
          <button type="button" onClick={deleteMember} disabled={busy} className="rounded-full bg-red-700 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{busy ? 'Deleting…' : 'Yes, delete'}</button>
        </div>
      </section>
    </div>}
  </>
}
