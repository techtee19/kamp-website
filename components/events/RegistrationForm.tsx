'use client'

// Inline event registration form with confirmation and capacity states.
import { FormEvent, useState } from 'react'
import UniversityCombobox from '@/components/ui/UniversityCombobox'

const inputClass =
  'mt-2 w-full rounded-lg border border-brand-ink/25 bg-brand-white px-4 py-3 outline-none focus:border-brand-gold'

// Must match registrationSchema's studyLevel enum in lib/validations.ts.
const studyLevels = ['100L', '200L', '300L', '400L', '500L', 'Postgrad', 'Other']

type RegistrationFormProps = {
  eventId: string
  eventTitle: string
  eventDate?: string
  eventLocation?: string
  capacity?: number
  registrationClosed?: boolean
}

export default function RegistrationForm({
  eventId,
  eventTitle,
  eventDate,
  eventLocation,
  capacity,
  registrationClosed = false,
}: RegistrationFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'full'>(
    'idle'
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  if (registrationClosed)
    return (
      <div className="rounded-xl border-l-4 border-brand-gold bg-brand-card p-7">
        <p className="font-display text-2xl font-semibold">Registration closed</p>
        <p className="mt-3 text-sm leading-relaxed text-brand-grey">
          This event has reached capacity. Please check our events page for the next opportunity to join KAMP.
        </p>
      </div>
    )

  // 409 covers both "event is full" and "this email already registered" — the API
  // owns that distinction, so its message is what gets shown.
  if (status === 'full')
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        {errorMessage ?? 'This event has reached maximum capacity.'}
      </div>
    )

  if (status === 'success')
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
        You&apos;re registered! Check your email for confirmation details.
        {eventDate && eventLocation ? ` We'll see you on ${eventDate} at ${eventLocation}.` : null}
      </div>
    )

  const submit = async (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault()
    setErrorMessage(null)
    setStatus('loading')

    const form = new FormData(formEvent.currentTarget)

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          eventTitle,
          fullName: form.get('fullName'),
          email: form.get('email'),
          phone: form.get('phone'),
          university: form.get('university'),
          studyLevel: form.get('studyLevel'),
        }),
      })

      const payload = await response.json().catch(() => null)

      if (response.status === 409) {
        // Event full, or this email is already on the list.
        setStatus('full')
        setErrorMessage(payload?.error ?? 'This event has reached maximum capacity.')
        return
      }

      if (!response.ok) {
        // The API owns capacity and duplicate checks, so surface its message.
        setStatus('error')
        setErrorMessage(payload?.error ?? 'Registration failed. Please try again.')
        return
      }

      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMessage('Could not reach the server. Please check your connection and try again.')
    }
  }

  const submitting = status === 'loading'

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-xl bg-brand-card p-6 md:grid-cols-2 md:p-8">
      {status === 'error' && errorMessage && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 md:col-span-2">
          {errorMessage}
        </div>
      )}

      <label className="text-sm font-medium">
        Full name
        <input name="fullName" required disabled={submitting} className={inputClass} />
      </label>
      <label className="text-sm font-medium">
        Email address
        <input name="email" required type="email" disabled={submitting} className={inputClass} />
      </label>
      <label className="text-sm font-medium">
        Phone number
        <input name="phone" required type="tel" disabled={submitting} className={inputClass} />
      </label>
      <label className="text-sm font-medium">
        University
        <UniversityCombobox name="university" required disabled={submitting} />
      </label>
      <label className="text-sm font-medium md:col-span-2">
        Level/year of study
        <select name="studyLevel" required disabled={submitting} defaultValue="" className={inputClass}>
          <option value="" disabled>
            Select your level
          </option>
          {studyLevels.map((level) => (
            <option key={level} value={level}>
              {level === 'Postgrad' ? 'Postgraduate' : level}
            </option>
          ))}
        </select>
      </label>

      {capacity ? (
        <p className="text-xs text-brand-grey md:col-span-2">
          Limited to {capacity} places.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="justify-self-start rounded-full bg-brand-ink px-6 py-3 text-sm text-brand-white transition disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2"
      >
        {submitting ? (
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Submitting...
          </span>
        ) : (
          'Confirm registration'
        )}
      </button>
    </form>
  )
}
