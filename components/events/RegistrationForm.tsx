'use client'

// Inline event registration form with confirmation and capacity states.
import { FormEvent, useState } from 'react'

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
  const [confirmed, setConfirmed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (registrationClosed)
    return (
      <div className="rounded-xl border-l-4 border-brand-gold bg-brand-card p-7">
        <p className="font-display text-2xl font-semibold">Registration closed</p>
        <p className="mt-3 text-sm leading-relaxed text-brand-grey">
          This event has reached capacity. Please check our events page for the next opportunity to join KAMP.
        </p>
      </div>
    )

  if (confirmed)
    return (
      <div className="rounded-xl border-l-4 border-brand-gold bg-brand-card p-7">
        <p className="font-display text-2xl font-semibold">You’re confirmed</p>
        <p className="mt-3 text-sm leading-relaxed text-brand-grey">
          Your place at {eventTitle} is reserved.{' '}
          {eventDate && eventLocation ? `We’ll see you on ${eventDate} at ${eventLocation}.` : null}{' '}
          We’ll send the event details to your email shortly.
        </p>
      </div>
    )

  const submit = async (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault()
    setError(null)
    setSubmitting(true)

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

      if (!response.ok) {
        // The API owns capacity and duplicate checks, so surface its message.
        setError(payload?.error ?? 'Registration failed. Please try again.')
        return
      }

      setConfirmed(true)
    } catch {
      setError('Could not reach the server. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-xl bg-brand-card p-6 md:grid-cols-2 md:p-8">
      <label className="text-sm font-medium">
        Full name
        <input name="fullName" required className={inputClass} />
      </label>
      <label className="text-sm font-medium">
        Email address
        <input name="email" required type="email" className={inputClass} />
      </label>
      <label className="text-sm font-medium">
        Phone number
        <input name="phone" required type="tel" className={inputClass} />
      </label>
      <label className="text-sm font-medium">
        University
        <input name="university" required className={inputClass} />
      </label>
      <label className="text-sm font-medium md:col-span-2">
        Level/year of study
        <select name="studyLevel" required defaultValue="" className={inputClass}>
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

      {error && (
        <p role="alert" className="text-sm font-medium text-red-700 md:col-span-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="justify-self-start rounded-full bg-brand-ink px-6 py-3 text-sm text-brand-white transition disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2"
      >
        {submitting ? 'Confirming…' : 'Confirm registration'}
      </button>
    </form>
  )
}
