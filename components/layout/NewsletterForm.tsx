'use client'

// Footer newsletter signup. There is no /api/subscribe route yet, so this
// validates the address and confirms client-side only — nothing is stored.
// TODO: POST to /api/subscribe once the route and mailing-list provider exist.
import { FormEvent, useState } from 'react'

// Deliberately loose: the input is type="email" so the browser has already done a
// structural check, and this only needs to reject the empty/obviously-wrong case.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmed = email.trim()
    if (!trimmed) {
      setStatus('error')
      setMessage('Please enter your email address.')
      return
    }
    if (!EMAIL_PATTERN.test(trimmed)) {
      setStatus('error')
      setMessage('Please enter a valid email address.')
      return
    }

    setStatus('loading')
    setMessage('')

    // Stands in for the network round-trip so the button's loading state is real
    // rather than a flash, and so swapping in a fetch() later changes one line.
    console.log('[newsletter] subscribe requested:', trimmed)
    await new Promise((resolve) => setTimeout(resolve, 400))

    setStatus('success')
    setMessage("Thanks! You'll hear from us soon.")
    setEmail('')
  }

  return (
    <>
      {/* The field and its button share one row even on the narrowest phone:
          the button keeps a fixed width and the input takes the rest. */}
      <form onSubmit={submit} noValidate className="mt-5 flex max-w-md gap-1 sm:gap-0">
        <label className="sr-only" htmlFor="footer-email">Email address</label>
        <input id="footer-email" type="email" value={email} onChange={(event) => { setEmail(event.target.value); if (status !== 'idle') { setStatus('idle'); setMessage('') } }} placeholder="Enter your Email Address" className="min-w-0 flex-1 rounded-full bg-brand-white/15 px-5 py-2.5 text-sm text-brand-white outline-none placeholder:text-brand-white/65 focus:ring-2 focus:ring-brand-gold" />
        <button type="submit" disabled={status === 'loading'} className="w-28 shrink-0 rounded-full bg-brand-gold py-2.5 text-sm text-brand-deep transition disabled:opacity-60 sm:-ml-3 sm:w-auto sm:px-5">
          {status === 'loading' ? (
            <span className="inline-flex items-center gap-2">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Sending
            </span>
          ) : (
            'Subscribe'
          )}
        </button>
      </form>

      {status === 'success' && (
        <p role="status" className="mt-3 text-[15px] leading-[20px] text-brand-gold lg:text-sm">{message}</p>
      )}
      {status === 'error' && (
        <p role="alert" className="mt-3 text-[15px] leading-[20px] text-red-300 lg:text-sm">{message}</p>
      )}
    </>
  )
}
