'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { countdownSeconds } from '@/lib/registration-flow'

const inputClass = 'mt-2 w-full rounded-lg border border-brand-ink/25 bg-brand-white px-4 py-3 outline-none focus:border-brand-gold'
const buttonClass = 'w-fit rounded-full bg-brand-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-50'

type Session = { memberId: string; challengeId: string; previousChallengeId?: string; retryAt: number }
type Member = { fullName: string; affiliation: string; level: string }
type Failure = { error?: string; retryAfter?: number }

export default function RegistrationForm({ eventId, eventSlug }: { eventId: string; eventSlug: string }) {
  const storageKey = `kamp:event-otp:${eventSlug}`
  const [session, setSession] = useState<Session>({ memberId: '', challengeId: '', retryAt: 0 })
  const [now, setNow] = useState(0)
  const [code, setCode] = useState('')
  const [member, setMember] = useState<Member | null>(null)
  const [proofId, setProofId] = useState('')
  const [busy, setBusy] = useState(false)
  const pending = useRef(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [ticketRef, setTicketRef] = useState('')
  const wait = countdownSeconds(session.retryAt, now)

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const stored = sessionStorage.getItem(storageKey)
        if (stored) setSession(JSON.parse(stored))
      } catch { /* Continue when browser storage is unavailable. */ }
      setNow(Date.now())
    })
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => { cancelAnimationFrame(frame); clearInterval(timer) }
  }, [storageKey])

  function save(value: Session) {
    setSession(value)
    setNow(Date.now())
    try { sessionStorage.setItem(storageKey, JSON.stringify(value)) } catch { /* Server still enforces cooldown. */ }
  }

  function editId(memberId: string) {
    save({ memberId: memberId.toUpperCase(), challengeId: '', retryAt: 0 })
    setCode('')
    setError('')
    setNotice('')
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending.current || (!session.challengeId && !member && wait > 0)) return
    if (member) {
      await post<{ ticketRef: string }>('/api/register', { eventId, memberChallengeId: proofId }, (data) => {
        setTicketRef(data.ticketRef)
        try { sessionStorage.removeItem(storageKey) } catch { /* Optional storage. */ }
      }, (status) => {
        if (status === 400) { setMember(null); setProofId(''); save({ ...session, challengeId: '', previousChallengeId: undefined }) }
      })
    } else if (session.challengeId) {
      await post<{ member: Member; challengeId: string }>('/api/register/member-verify', { eventId, challengeId: session.challengeId, previousChallengeId: session.previousChallengeId, code }, (data) => {
        setMember(data.member)
        setProofId(data.challengeId)
        setCode('')
        save({ ...session, challengeId: '', previousChallengeId: undefined })
      })
    } else {
      await requestCode()
    }
  }

  async function requestCode() {
    if (wait > 0 || session.memberId.trim().length < 5) return
    await post<{ challengeId: string; retryAfter: number }>('/api/register/member-code', { eventId, memberId: session.memberId }, (data) => {
      save({ ...session, previousChallengeId: session.challengeId || undefined, challengeId: data.challengeId, retryAt: Date.now() + data.retryAfter * 1000 })
      setCode('')
      setNotice(session.challengeId
        ? 'If we could send a new verification code, please use the latest code to verify your membership.'
        : 'If that ID matches an active membership and email is available, a six-digit code will arrive at the address on file.')
    }, (status, data) => {
      if (status === 429 && typeof data?.retryAfter === 'number') {
        save({ ...session, retryAt: Date.now() + data.retryAfter * 1000 })
      }
    })
  }

  async function post<T>(path: string, body: object, success: (data: T) => void, failure?: (status: number, data: Failure | null) => void) {
    if (pending.current) return
    pending.current = true
    setBusy(true)
    setError('')
    setNotice('')
    try {
      const response = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await response.json().catch(() => null)
      if (!response.ok || !data) {
        failure?.(response.status, data)
        setError(data?.error ?? 'The service is temporarily unavailable. Please try again.')
      } else success(data as T)
    } catch {
      setError('Could not reach the server. Check your connection and try again.')
    } finally {
      pending.current = false
      setBusy(false)
    }
  }

  if (ticketRef) return (
    <div role="status" className="rounded-lg border border-green-200 bg-green-50 p-5 text-sm text-green-800">
      <p className="font-semibold">Your place is confirmed.</p>
      <p className="mt-2">Save your ticket reference <strong className="font-mono">{ticketRef}</strong>. Your ticket will be sent by email.</p>
      <Link href="/contact?subject=event-ticket" className="mt-2 inline-block underline">Get help if your ticket doesn’t arrive</Link>
    </div>
  )

  const timer = `${String(Math.floor(wait / 60)).padStart(2, '0')}:${String(wait % 60).padStart(2, '0')}`
  return (
    <form onSubmit={submit} className="grid gap-4 rounded-xl bg-brand-card p-6 md:p-8">
      {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      {notice && <p role="status" className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">{notice}</p>}
      {member ? (
        <>
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            <p className="font-semibold">Membership verified</p>
            <p>{member.fullName} · {member.affiliation} · {member.level}</p>
            <p>Your ticket will go to the address on your KAMP membership.</p>
          </div>
          <button type="submit" disabled={busy} className={buttonClass}>{busy ? 'Confirming…' : 'Confirm registration'}</button>
        </>
      ) : (
        <>
          <p className="text-sm text-brand-grey">Event registration is for KAMP members. Enter your member ID to request a code by email.</p>
          <label className="text-sm font-medium">KAMP member ID
            <input value={session.memberId} onChange={(event) => editId(event.target.value)} required minLength={5} maxLength={64} autoComplete="off" disabled={busy} className={inputClass} placeholder="KAMP-…" />
          </label>
          <Link href={`/membership?event=${encodeURIComponent(eventSlug)}#apply`} className="w-fit text-sm font-semibold underline decoration-brand-gold underline-offset-4">
            New to KAMP? Join to register for this event
          </Link>
          {session.challengeId ? (
            <>
              <label className="text-sm font-medium">Six-digit verification code
                <input value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} required inputMode="numeric" pattern="[0-9]{6}" autoComplete="one-time-code" disabled={busy} className={inputClass} />
              </label>
              <p className="text-sm text-brand-grey">Please enter the latest verification code sent to your email. Previous codes are no longer valid. Check spam or junk if you can’t find it.</p>
              <div className="flex flex-wrap items-center gap-4">
                <button type="submit" disabled={busy || code.length !== 6} className={buttonClass}>{busy ? 'Please wait…' : 'Verify code'}</button>
                <button type="button" onClick={requestCode} disabled={busy || wait > 0} className="text-sm font-semibold underline disabled:opacity-55">
                  {wait > 0 ? `Resend code in ${timer}` : 'Resend code'}
                </button>
              </div>
            </>
          ) : (
            <button type="submit" disabled={busy || wait > 0} className={buttonClass}>
              {busy ? 'Requesting…' : wait > 0 ? `Try again in ${timer}` : 'Send verification code'}
            </button>
          )}
          <Link href="/membership/support" className="w-fit text-sm text-brand-grey underline underline-offset-4">Need help with your email address or membership ID?</Link>
        </>
      )}
    </form>
  )
}
