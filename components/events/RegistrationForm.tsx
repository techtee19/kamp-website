'use client'

// Inline event registration form with confirmation and capacity states.
import { FormEvent, useState } from 'react'
import InstitutionCombobox from '@/components/ui/InstitutionCombobox'

const inputClass =
  'mt-2 w-full rounded-lg border border-brand-ink/25 bg-brand-white px-4 py-3 outline-none focus:border-brand-gold'

// Must match registrationSchema's studyLevel enum in lib/validations.ts.
const studyLevels = ['100L', '200L', '300L', '400L', '500L', 'Postgrad', 'Other']

type RegistrationFormProps = {
  eventId: string
  eventDate?: string
  eventLocation?: string
  capacity?: number
  registrationClosed?: boolean
}

export default function RegistrationForm({
  eventId,
  eventDate,
  eventLocation,
  capacity,
  registrationClosed = false,
}: RegistrationFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'full'>(
    'idle'
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState<boolean | null>(null)
  const [registrationMode, setRegistrationMode] = useState<'guest' | 'member'>('guest')
  const [memberId, setMemberId] = useState('')
  const [challengeId, setChallengeId] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [codeRequested, setCodeRequested] = useState(false)
  const [requestingCode, setRequestingCode] = useState(false)
  const [verifyingCode, setVerifyingCode] = useState(false)
  const [verifiedMember, setVerifiedMember] = useState<{
    fullName: string
    email: string
    phone: string
    affiliation: string
    level: string
  } | null>(null)

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
        {emailSent
          ? 'You’re registered! Check your email for confirmation details.'
          : 'You’re registered, but we could not send the confirmation email. Please contact KAMP for your ticket.'}
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
        body: JSON.stringify(registrationMode === 'member'
          ? { eventId, memberChallengeId: challengeId }
          : {
              eventId,
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

      setEmailSent(payload?.emailSent === true)
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMessage('Could not reach the server. Please check your connection and try again.')
    }
  }

  const requestMemberCode = async () => {
    setErrorMessage(null)
    setRequestingCode(true)
    setVerifiedMember(null)
    setChallengeId('')
    try {
      const response = await fetch('/api/register/member-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, memberId }),
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        setErrorMessage(payload?.error ?? 'Could not request a code. Please try again.')
        return
      }
      setChallengeId(payload.challengeId)
      setCodeRequested(true)
      setErrorMessage('If that is an active KAMP member ID, a six-digit code has been sent to the email address on the membership record.')
    } catch {
      setErrorMessage('Could not reach the server. Please try again.')
    } finally {
      setRequestingCode(false)
    }
  }

  const verifyMemberCode = async () => {
    setErrorMessage(null)
    setVerifyingCode(true)
    try {
      const response = await fetch('/api/register/member-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, challengeId, code: verificationCode }),
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        setErrorMessage(payload?.error ?? 'Could not verify that code.')
        return
      }
      setVerifiedMember(payload.member)
      setErrorMessage(null)
    } catch {
      setErrorMessage('Could not reach the server. Please try again.')
    } finally {
      setVerifyingCode(false)
    }
  }

  const submitting = status === 'loading'

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-xl bg-brand-card p-6 md:grid-cols-2 md:p-8">
      {errorMessage && (
        <div role={status === 'error' ? 'alert' : 'status'} className={`rounded-lg border px-4 py-3 text-sm md:col-span-2 ${errorMessage.startsWith('If that is') ? 'border-blue-200 bg-blue-50 text-blue-900' : 'border-red-200 bg-red-50 text-red-800'}`}>
          {errorMessage}
        </div>
      )}

      <div className="flex gap-2 md:col-span-2" role="group" aria-label="Registration type">
        <button type="button" onClick={() => { setRegistrationMode('guest'); setVerifiedMember(null); setCodeRequested(false); setErrorMessage(null) }} aria-pressed={registrationMode === 'guest'} className={`rounded-full px-4 py-2 text-sm font-medium ${registrationMode === 'guest' ? 'bg-brand-ink text-white' : 'border border-brand-ink/20 bg-white'}`}>Register as a guest</button>
        <button type="button" onClick={() => { setRegistrationMode('member'); setVerifiedMember(null); setCodeRequested(false); setErrorMessage(null) }} aria-pressed={registrationMode === 'member'} className={`rounded-full px-4 py-2 text-sm font-medium ${registrationMode === 'member' ? 'bg-brand-ink text-white' : 'border border-brand-ink/20 bg-white'}`}>I’m a KAMP member</button>
      </div>

      {registrationMode === 'member' ? (
        <>
          {!verifiedMember ? (
            <>
              <p className="text-sm leading-relaxed text-brand-grey md:col-span-2">Enter your KAMP member ID. We’ll send a one-time code to the email address saved on your membership record.</p>
              <label className="text-sm font-medium md:col-span-2">
                KAMP member ID
                <input value={memberId} onChange={(event) => setMemberId(event.target.value.toUpperCase())} required maxLength={64} autoComplete="off" disabled={requestingCode || submitting} className={inputClass} placeholder="KAMP-…" />
              </label>
              {!codeRequested ? (
                <button type="button" onClick={requestMemberCode} disabled={requestingCode || !memberId.trim()} className="justify-self-start rounded-full bg-brand-ink px-6 py-3 text-sm text-brand-white disabled:opacity-60 md:col-span-2">
                  {requestingCode ? 'Sending code…' : 'Send verification code'}
                </button>
              ) : (
                <>
                  <p role="status" className="text-sm text-brand-grey md:col-span-2">If the ID is active, a code is on its way to the email on file.</p>
                  <label className="text-sm font-medium md:col-span-2">
                    Six-digit email code
                    <input value={verificationCode} onChange={(event) => setVerificationCode(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" required maxLength={6} disabled={verifyingCode || submitting} className={inputClass} />
                  </label>
                  <button type="button" onClick={verifyMemberCode} disabled={verifyingCode || verificationCode.length !== 6 || !challengeId} className="justify-self-start rounded-full bg-brand-ink px-6 py-3 text-sm text-brand-white disabled:opacity-60 md:col-span-2">
                    {verifyingCode ? 'Verifying…' : 'Verify member ID'}
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-900 md:col-span-2">
                <p className="font-semibold">Membership verified</p>
                <p className="mt-1">{verifiedMember.fullName} · {verifiedMember.affiliation} · {verifiedMember.level}</p>
                <p className="mt-1 text-green-800">Ticket confirmation will be sent to {verifiedMember.email}.</p>
              </div>
              {capacity ? <p className="text-xs text-brand-grey md:col-span-2">Limited to {capacity} places.</p> : null}
              <button type="submit" disabled={submitting} className="justify-self-start rounded-full bg-brand-ink px-6 py-3 text-sm text-brand-white transition disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2">
                {submitting ? 'Submitting…' : 'Confirm registration'}
              </button>
            </>
          )}
        </>
      ) : (
        <>

      <label className="text-sm font-medium">
        Full name
        <input name="fullName" required maxLength={120} disabled={submitting} className={inputClass} />
      </label>

      {capacity ? (
        <p className="text-xs text-brand-grey md:col-span-2">Limited to {capacity} places.</p>
      ) : null}
      <label className="text-sm font-medium">
        Email address
        <input name="email" required type="email" maxLength={254} disabled={submitting} className={inputClass} />
      </label>
      <label className="text-sm font-medium">
        Phone number
        <input name="phone" required type="tel" maxLength={24} disabled={submitting} className={inputClass} />
      </label>
      <label className="text-sm font-medium">
        Tertiary institution
        <InstitutionCombobox name="university" required disabled={submitting} />
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
        </>
      )}
    </form>
  )
}
