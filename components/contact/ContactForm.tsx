'use client'

// Sends a KAMP contact enquiry and displays its confirmation state inline.
import { FormEvent, useState } from 'react'

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    setStatus('sending')

    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(form))) })
      if (!response.ok) throw new Error('Unable to send message')
      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') return <div className="rounded-2xl border-l-4 border-brand-gold bg-brand-card p-8 md:p-10"><p className="font-display text-3xl font-semibold">Message received.</p><p className="mt-3 text-sm leading-relaxed text-brand-grey">Thank you for reaching out to KAMP. A member of our team will be in touch soon.</p><button type="button" onClick={() => setStatus('idle')} className="mt-7 rounded-full bg-brand-ink px-6 py-3 text-sm text-brand-white">Send another message</button></div>

  return <form onSubmit={submit} className="rounded-2xl bg-brand-card p-6 md:p-8"><div className="grid gap-4 md:grid-cols-2">
    <label className="text-sm font-medium">Full name<input required name="name" className="mt-2 w-full rounded-xl border border-brand-ink/20 bg-brand-white px-4 py-3 outline-none focus:border-brand-gold" /></label>
    <label className="text-sm font-medium">Email address<input required type="email" name="email" className="mt-2 w-full rounded-xl border border-brand-ink/20 bg-brand-white px-4 py-3 outline-none focus:border-brand-gold" /></label>
    <label className="text-sm font-medium md:col-span-2">Subject<input required name="subject" className="mt-2 w-full rounded-xl border border-brand-ink/20 bg-brand-white px-4 py-3 outline-none focus:border-brand-gold" placeholder="How can we help?" /></label>
    <label className="text-sm font-medium md:col-span-2">Message<textarea required name="message" rows={6} className="mt-2 w-full resize-none rounded-xl border border-brand-ink/20 bg-brand-white px-4 py-3 outline-none focus:border-brand-gold" placeholder="Tell us a little more" /></label>
  </div>{status === 'error' && <p className="mt-4 text-sm text-brand-grey">We couldn&apos;t send your message just now. Please try again in a moment.</p>}<button type="submit" disabled={status === 'sending'} className="mt-7 rounded-full bg-brand-ink px-6 py-3 text-sm text-brand-white transition hover:bg-brand-black disabled:opacity-60">{status === 'sending' ? 'Sending…' : 'Send message'}</button></form>
}
