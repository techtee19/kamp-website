'use client'

// Sends a KAMP contact enquiry and displays its confirmation state inline.
import { FormEvent, useState } from 'react'

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form))
    setErrorMessage(null)
    setStatus('loading')

    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      const payload = await response.json().catch(() => null)

      if (!response.ok) {
        setStatus('error')
        setErrorMessage(payload?.error ?? 'Failed to send message.')
        return
      }

      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
      setErrorMessage('Network error. Please try again.')
    }
  }

  if (status === 'success') return <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">Message received! We&apos;ll get back to you soon.</div>

  const submitting = status === 'loading'

  return <form onSubmit={submit} className="rounded-2xl bg-brand-card p-6 md:p-8">{status === 'error' && errorMessage && <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{errorMessage}</div>}<div className="grid gap-4 md:grid-cols-2">
    <label className="text-sm font-medium">Full name<input required name="name" disabled={submitting} className="mt-2 w-full rounded-xl border border-brand-ink/20 bg-brand-white px-4 py-3 outline-none focus:border-brand-gold" /></label>
    <label className="text-sm font-medium">Email address<input required type="email" name="email" disabled={submitting} className="mt-2 w-full rounded-xl border border-brand-ink/20 bg-brand-white px-4 py-3 outline-none focus:border-brand-gold" /></label>
    <label className="text-sm font-medium md:col-span-2">Subject<input required name="subject" disabled={submitting} className="mt-2 w-full rounded-xl border border-brand-ink/20 bg-brand-white px-4 py-3 outline-none focus:border-brand-gold" placeholder="How can we help?" /></label>
    <label className="text-sm font-medium md:col-span-2">Message<textarea required name="message" rows={6} disabled={submitting} className="mt-2 w-full resize-none rounded-xl border border-brand-ink/20 bg-brand-white px-4 py-3 outline-none focus:border-brand-gold" placeholder="Tell us a little more" /></label>
  </div><button type="submit" disabled={submitting} className="mt-7 rounded-full bg-brand-ink px-6 py-3 text-sm text-brand-white transition hover:bg-brand-black disabled:opacity-60">{submitting ? <span className="inline-flex items-center gap-2"><span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />Submitting...</span> : 'Send message'}</button></form>
}
