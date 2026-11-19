'use client'

import { useRef, useState, type ClipboardEvent, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowUpRight, Check, ChevronDown, ImagePlus, LoaderCircle, Mail, Send, X } from 'lucide-react'
import type { SupportReply } from '@/lib/membership-support-data'
import { MAX_SUPPORT_IMAGES, MAX_SUPPORT_IMAGE_BYTES, supportImageFilename, type SupportImage } from '@/lib/support-reply-images'

const states: Record<string, string> = {
  pending: 'Queued', sending: 'Sending', accepted: 'Accepted by email provider', delivered: 'Delivered',
  delayed: 'Delivery delayed', bounced: 'Bounced', suppressed: 'Suppressed', failed: 'Failed', unknown: 'Awaiting confirmation',
}
const field = 'mt-2 min-h-11 w-full rounded-xl border border-brand-ink/15 bg-white px-4 py-2.5 text-sm text-brand-ink outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20'
const dateLabel = (date: string) => new Date(date).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Africa/Lagos' })

export default function SupportReplyComposer({ requestId, recipient, replyTo, suggestedMessage, replies, resolved }: {
  requestId: string
  recipient: string
  replyTo: string
  suggestedMessage: string
  replies: SupportReply[]
  resolved: boolean
}) {
  const router = useRouter()
  const sending = useRef(false)
  const addingImages = useRef(false)
  const imageInput = useRef<HTMLInputElement>(null)
  const attempt = useRef<{ replyId: string; subject: string; message: string; imageSignature: string } | null>(null)
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [subject, setSubject] = useState('Your KAMP membership support request')
  const [message, setMessage] = useState('')
  const [notice, setNotice] = useState('')
  const [failed, setFailed] = useState(false)
  const [images, setImages] = useState<SupportImage[]>([])
  const [loadingImages, setLoadingImages] = useState(false)
  const [imageError, setImageError] = useState('')

  async function addImages(files: File[]) {
    if (!files.length || sending.current || addingImages.current) return
    setImageError('')
    if (files.some((file) => !['image/png', 'image/jpeg'].includes(file.type) || !file.size)) {
      setImageError('Choose PNG or JPG screenshots.')
      return
    }
    const existingBytes = images.reduce((total, image) => total + image.content.length * 3 / 4
      - (image.content.endsWith('==') ? 2 : image.content.endsWith('=') ? 1 : 0), 0)
    if (images.length + files.length > MAX_SUPPORT_IMAGES || existingBytes + files.reduce((sum, file) => sum + file.size, 0) > MAX_SUPPORT_IMAGE_BYTES) {
      setImageError('You can add up to three screenshots, with a combined size of 2 MB.')
      return
    }
    addingImages.current = true
    setLoadingImages(true)
    try {
      const added = await Promise.all(files.map((file) => new Promise<SupportImage>((resolve, reject) => {
        const reader = new FileReader()
        reader.onerror = () => reject(new Error('Could not read the screenshot. Please choose it again.'))
        reader.onload = () => resolve({ filename: supportImageFilename(file.name, file.type as SupportImage['contentType']), contentType: file.type as SupportImage['contentType'], content: String(reader.result).split(',')[1] })
        reader.readAsDataURL(file)
      })))
      setImages((previous) => [...previous, ...added])
    } catch (error) {
      setImageError(error instanceof Error ? error.message : 'Could not read the screenshot. Please choose it again.')
    } finally {
      addingImages.current = false
      setLoadingImages(false)
    }
  }

  function pasteScreenshot(event: ClipboardEvent<HTMLTextAreaElement>) {
    const files = Array.from(event.clipboardData.items).filter((item) => item.type.startsWith('image/'))
      .map((item) => item.getAsFile()).filter((file): file is File => Boolean(file))
    if (!files.length) return
    event.preventDefault()
    void addImages(files)
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (sending.current || addingImages.current) return
    sending.current = true
    setBusy(true)
    setNotice('')
    setFailed(false)
    const content = { subject: subject.trim(), message: message.trim() }
    const imageSignature = JSON.stringify(images)
    if (!attempt.current || attempt.current.subject !== content.subject || attempt.current.message !== content.message || attempt.current.imageSignature !== imageSignature) {
      attempt.current = { ...content, imageSignature, replyId: crypto.randomUUID() }
    }
    try {
      const response = await fetch('/admin/api/members/support/reply', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supportId: requestId, replyId: attempt.current.replyId, ...content, images }),
      })
      const result = await response.json().catch(() => null)
      if (!response.ok) throw new Error(result?.error ?? 'Could not queue your reply. Please try again.')
      setNotice('Reply queued. Check its delivery status below. This support request stays open until you mark it resolved.')
      setMessage('')
      setImages([])
      setImageError('')
      attempt.current = null
      router.refresh()
    } catch (error) {
      setFailed(true)
      setNotice(error instanceof Error && !(error instanceof TypeError) ? error.message : 'Connection lost. Refresh the reply history before trying again. Retrying the same message will not create a second reply.')
    } finally {
      sending.current = false
      setBusy(false)
    }
  }

  return <section aria-label="Email replies" className="overflow-hidden rounded-2xl border border-brand-card bg-brand-cream/40">
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-gold/20 text-brand-ink"><Mail aria-hidden="true" className="size-5" /></span>
        <div><h2 className="text-sm font-semibold">Keep the conversation going</h2><p className="mt-1 text-xs leading-5 text-brand-grey">Reply directly to the email on this request.</p></div>
      </div>
      {!resolved && <button type="button" aria-expanded={open} aria-controls={`reply-${requestId}`} onClick={() => setOpen(!open)} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-ink px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 active:opacity-80">
        Reply by email <ChevronDown aria-hidden="true" className={`size-4 transition-transform motion-reduce:transition-none ${open ? 'rotate-180' : ''}`} />
      </button>}
    </div>
    {open && !resolved && <form id={`reply-${requestId}`} onSubmit={submit} className="space-y-4 border-t border-brand-card p-4 sm:p-5">
      <p className="break-all text-sm"><span className="text-brand-grey">To</span> <strong className="ml-2 font-medium">{recipient}</strong></p>
      <p className="break-all text-xs text-brand-grey">Replies go to {replyTo ? <a href={`mailto:${replyTo}`} className="font-semibold text-brand-ink underline underline-offset-4">{replyTo}</a> : 'the admin email once configured'}.</p>
      <label className="block text-xs font-semibold text-brand-grey">Subject<input required maxLength={160} value={subject} onChange={(event) => setSubject(event.target.value)} disabled={busy} className={field} /></label>
      <label className="block text-xs font-semibold text-brand-grey">Your message<textarea required minLength={10} maxLength={5000} rows={8} value={message} onChange={(event) => setMessage(event.target.value)} onPaste={pasteScreenshot} disabled={busy} placeholder="Write a helpful reply… You can also paste a screenshot here." className={`${field} resize-y font-normal leading-6`} /></label>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-brand-grey">
        <button type="button" disabled={busy} onClick={() => setMessage(suggestedMessage)} className="inline-flex min-h-9 items-center gap-1.5 font-semibold text-brand-ink underline decoration-brand-gold decoration-2 underline-offset-4">Use suggested reply <ArrowUpRight aria-hidden="true" className="size-3.5" /></button>
        <span>{message.length.toLocaleString()}/5,000</span>
      </div>
      <div className="space-y-3 rounded-xl border border-dashed border-brand-ink/20 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><p className="text-sm font-semibold">Screenshot evidence</p><p className="mt-1 text-xs leading-5 text-brand-grey">Paste into your message or upload up to three PNG/JPG images. 2 MB total.</p></div>
          <button type="button" onClick={() => imageInput.current?.click()} disabled={busy || loadingImages || images.length >= MAX_SUPPORT_IMAGES} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-brand-card px-4 text-xs font-semibold hover:bg-brand-cream disabled:opacity-50"><ImagePlus aria-hidden="true" className="size-4" />{loadingImages ? 'Reading images…' : 'Add screenshots'}</button>
          <input ref={imageInput} type="file" accept="image/png,image/jpeg" multiple tabIndex={-1} aria-label="Choose screenshots" className="hidden" onChange={(event) => { void addImages(Array.from(event.target.files ?? [])); event.target.value = '' }} />
        </div>
        {imageError && <p role="alert" className="text-xs leading-5 text-red-800">{imageError}</p>}
        {images.length > 0 && <div className="grid gap-3 sm:grid-cols-2">
          {images.map((image, index) => <figure key={index} className="overflow-hidden rounded-xl border border-brand-card bg-brand-cream/30">
            <Image unoptimized src={`data:${image.contentType};base64,${image.content}`} alt={`Screenshot preview: ${image.filename}`} width={600} height={350} className="h-40 w-full object-contain p-2" />
            <figcaption className="flex items-center justify-between gap-2 border-t border-brand-card px-3 py-2"><span className="truncate text-xs text-brand-grey">{image.filename}</span><button type="button" disabled={busy || loadingImages} onClick={() => setImages((previous) => previous.filter((_, position) => position !== index))} aria-label={`Remove ${image.filename}`} className="grid size-9 shrink-0 place-items-center rounded-full text-brand-ink hover:bg-brand-card"><X aria-hidden="true" className="size-4" /></button></figcaption>
          </figure>)}
        </div>}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button disabled={busy || loadingImages} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-black disabled:opacity-60">
          {busy ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin motion-reduce:animate-none" /> : <Send aria-hidden="true" className="size-4" />}{busy ? 'Queueing reply…' : 'Send email reply'}
        </button>
        <p className="text-xs text-brand-grey">Their response goes to KAMP’s admin email.</p>
      </div>
    </form>}
    {notice && <p role={failed ? 'alert' : 'status'} className={`mx-4 mb-4 rounded-xl px-4 py-3 text-sm leading-6 sm:mx-5 ${failed ? 'bg-red-50 text-red-800' : 'bg-emerald-50 text-emerald-800'}`}>{notice}</p>}
    {replies.length > 0 && <div className="space-y-3 border-t border-brand-card p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3"><h3 className="text-xs font-semibold uppercase tracking-wider text-brand-grey">Reply history</h3><button type="button" onClick={() => router.refresh()} className="min-h-9 text-xs font-semibold underline underline-offset-4">Refresh status</button></div>
      {replies.map((reply) => <details key={reply.id} className="rounded-xl border border-brand-card bg-white px-4 py-3">
        <summary className="cursor-pointer text-sm">
          <span className="font-semibold">{reply.subject}</span>
          <span className="mt-2 flex flex-wrap items-center gap-2 text-xs text-brand-grey"><span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium ${['failed', 'bounced', 'suppressed', 'unknown'].includes(reply.status) ? 'bg-red-50 text-red-800' : 'bg-brand-cream text-brand-ink'}`}>{reply.status === 'delivered' && <Check aria-hidden="true" className="size-3" />}{states[reply.status] ?? reply.status}</span>{dateLabel(reply.created_at)}</span>
        </summary>
        <p className="mt-3 break-all text-xs text-brand-grey">To {reply.recipient}</p>
        {reply.reply_to && <p className="mt-1 break-all text-xs text-brand-grey">Reply address: <a href={`mailto:${reply.reply_to}`} className="font-medium text-brand-ink underline underline-offset-4">{reply.reply_to}</a></p>}
        <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6">{reply.message}</p>
        {reply.images?.length > 0 && <div className="mt-4 grid gap-3 sm:grid-cols-2">{reply.images.map((image) => <a key={image.id} href={`/admin/api/members/support/reply/images/${image.id}`} target="_blank" rel="noopener noreferrer" className="overflow-hidden rounded-xl border border-brand-card"><Image unoptimized src={`/admin/api/members/support/reply/images/${image.id}`} alt={image.filename} width={600} height={350} className="h-40 w-full object-contain bg-brand-cream/40 p-2" /><span className="block break-all border-t border-brand-card p-3 text-xs font-medium">{image.filename} ↗</span></a>)}</div>}
        {reply.next_retry_at && reply.status === 'pending' && <p className="mt-3 text-xs text-brand-grey">Next retry from {dateLabel(reply.next_retry_at)}</p>}
        {reply.error_category && <p className="mt-3 text-xs text-red-800">Delivery issue: {reply.error_category.replaceAll('_', ' ')}. {reply.status === 'unknown' ? 'Check this message in Resend before issuing another copy.' : 'Review the email address and email provider status.'}</p>}
      </details>)}
    </div>}
  </section>
}
