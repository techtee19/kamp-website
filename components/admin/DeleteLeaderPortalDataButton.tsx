'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Trash2 } from 'lucide-react'

type Props = { kind: 'leader' | 'report' | 'request'; id: number; label: string }

export default function DeleteLeaderPortalDataButton({ kind, id, label }: Props) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const descriptionId = useId()
  const descriptions = {
    leader: `Permanently remove ${label}'s Leaders Portal account and all reports and requests submitted through it? This does not delete a KAMP membership record.`,
    report: `Permanently delete the report “${label}”?`,
    request: `Permanently delete the support request “${label}”?`,
  }

  useEffect(() => {
    if (!confirmOpen) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    cancelRef.current?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus()
    }
  }, [confirmOpen])

  useEffect(() => {
    if (!confirmOpen) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !busy) {
        event.preventDefault()
        setConfirmOpen(false)
        return
      }
      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled])'))
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [confirmOpen, busy])

  async function remove() {
    setBusy(true); setError('')
    try {
      const response = await fetch(`/admin/api/${kind === 'leader' ? 'leaders' : `${kind}s`}/${id}`, { method: 'DELETE' })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Could not delete this record.')
      setConfirmOpen(false)
      router.refresh()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not delete this record.')
    } finally { setBusy(false) }
  }

  return <span className="inline-flex flex-col items-start gap-1">
    <button type="button" onClick={() => { setError(''); setConfirmOpen(true) }} aria-label={`Delete ${kind}: ${label}`} className="inline-flex items-center gap-1.5 rounded-full border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:border-red-300 hover:bg-red-50 active:scale-[.98] motion-reduce:transition-none"><Trash2 size={13} aria-hidden="true" />Delete</button>
    {confirmOpen && typeof document !== 'undefined' && createPortal(
      <div className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-brand-black/45 p-4 backdrop-blur-[3px] animate-[fade-in_150ms_ease-out] motion-reduce:animate-none" onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) setConfirmOpen(false) }}>
        <div ref={dialogRef} role="alertdialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId} className="w-full max-w-md overflow-hidden rounded-[1.75rem] border border-white/70 bg-white shadow-[0_28px_90px_rgba(20,18,14,.28)] animate-[fade-in_180ms_ease-out] motion-reduce:animate-none">
          <div className="h-1.5 bg-gradient-to-r from-brand-gold via-brand-gold to-brand-ink" />
          <div className="p-6 sm:p-7">
            <div className="flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-red-50 text-red-700 ring-1 ring-red-100"><AlertTriangle size={19} strokeWidth={1.8} aria-hidden="true" /></span>
              <div className="min-w-0 pt-0.5"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-brand-ink/60">KAMP · ADMIN</p><h2 id={titleId} className="mt-1.5 font-display text-xl font-semibold tracking-tight text-brand-black">Delete {kind === 'leader' ? 'leader account' : kind}?</h2></div>
            </div>
            <p id={descriptionId} className="mt-5 text-sm leading-6 text-black/65">{descriptions[kind]}</p>
            <p className="mt-3 truncate rounded-xl bg-brand-cream px-3.5 py-2.5 text-sm font-semibold text-brand-black">{label}</p>
            {error && <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">{error}</p>}
            <div className="mt-7 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
              <button ref={cancelRef} type="button" disabled={busy} onClick={() => setConfirmOpen(false)} className="min-h-11 rounded-full border border-black/10 bg-white px-5 text-sm font-semibold text-brand-black transition hover:bg-brand-cream active:scale-[.98] disabled:opacity-50 motion-reduce:transition-none">Keep this record</button>
              <button type="button" disabled={busy} onClick={() => void remove()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-red-700 px-5 text-sm font-semibold text-white shadow-[0_5px_14px_rgba(185,28,28,.2)] transition hover:bg-red-800 active:scale-[.98] disabled:cursor-wait disabled:opacity-60 motion-reduce:transition-none"><Trash2 size={15} aria-hidden="true" />{busy ? 'Deleting…' : 'Delete permanently'}</button>
            </div>
          </div>
        </div>
      </div>,
      document.body,
    )}
  </span>
}
