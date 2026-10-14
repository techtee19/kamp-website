'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm, Controller, type FieldErrors } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, CheckCircle2, LoaderCircle, ShieldCheck } from 'lucide-react'
import InstitutionCombobox from '@/components/ui/InstitutionCombobox'
import { KAMP_POSITIONS, membershipSchema, NIGERIAN_STATES, type MembershipInput } from '@/lib/validations'

const studyLevels = ['100L', '200L', '300L', '400L', '500L', 'Postgraduate', 'Other'] as const
const membershipFieldLabels: Partial<Record<keyof MembershipInput, string>> = {
  firstName: 'First name', lastName: 'Last name', email: 'Email address', phone: 'Phone number',
  membershipType: 'Membership category', dateOfBirth: 'Date of birth', university: 'Tertiary institution',
  gender: 'Gender', stateOfOrigin: 'State of origin', studyLevel: 'Study level', occupation: 'Profession or current activity',
  organization: 'Organization', kampPosition: 'KAMP position', kampPositionOther: 'KAMP position', whyJoin: 'Why do you want to join KAMP?',
}
const inputBaseClass = 'mt-2 min-h-12 w-full rounded-xl border bg-white px-4 py-3 text-brand-ink outline-none transition duration-150 placeholder:text-brand-grey/65 focus:ring-4 motion-reduce:transition-none'
const inputClass = (invalid: boolean) => `${inputBaseClass} ${invalid ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-brand-ink/15 hover:border-brand-ink/30 focus:border-brand-gold focus:ring-brand-gold/15'}`

export default function MembershipForm({ leadershipInvite }: { leadershipInvite?: { token: string; email: string; role: string } }) {
  const [success, setSuccess] = useState<{ memberId: string; emailSent: boolean } | null>(null)
  const [serverError, setServerError] = useState('')
  const [validationMessage, setValidationMessage] = useState('')
  const [validationDetails, setValidationDetails] = useState<string[]>([])
  const validationSummaryRef = useRef<HTMLDivElement>(null)
  const [passportPhoto, setPassportPhoto] = useState<File | null>(null)
  const [photoError, setPhotoError] = useState('')
  const { register, control, handleSubmit, watch, setError, formState: { errors, isSubmitting } } = useForm<MembershipInput>({
    resolver: zodResolver(membershipSchema), mode: 'onBlur',
    defaultValues: { firstName: '', lastName: '', email: leadershipInvite?.email ?? '', phone: '', membershipType: 'student', kampPosition: 'General Member', kampPositionOther: '', dateOfBirth: '', university: '', gender: undefined, stateOfOrigin: undefined, studyLevel: undefined, occupation: '', organization: '', whyJoin: '' },
  })
  const membershipType = watch('membershipType')
  const kampPosition = watch('kampPosition')
  const whyJoin = watch('whyJoin') ?? ''

  useEffect(() => {
    if (validationMessage) validationSummaryRef.current?.focus()
  }, [validationMessage])

  function handleInvalidSubmit(invalidFields: FieldErrors<MembershipInput>) {
    setServerError('')
    const details = Object.entries(invalidFields).map(([field, issue]) => {
      const label = membershipFieldLabels[field as keyof MembershipInput] ?? field
      const message = issue?.message ? String(issue.message) : 'Check this field.'
      return `${label}: ${message}`
    })
    setValidationMessage(details.length ? 'Please check the following before submitting:' : 'The form could not be validated. Please reload and try again.')
    setValidationDetails(details.length ? details : ['The form could not be validated. Please reload and try again.'])
  }

  async function submit(values: MembershipInput) {
    setServerError('')
    setValidationMessage('')
    setValidationDetails([])
    if (!passportPhoto || photoError || passportPhoto.size > 2 * 1024 * 1024) {
      if (!passportPhoto) {
        setPhotoError('Please add a passport-style photo.')
        setValidationMessage('Please add a passport-style photo before submitting your application.')
        setValidationDetails(['Passport-style photo: Please choose a JPG or PNG image.'])
      } else if (passportPhoto.size > 2 * 1024 * 1024) {
        setPhotoError('Photo must be 2 MB or smaller.')
        setValidationMessage('Please choose a smaller passport-style photo before submitting your application.')
        setValidationDetails(['Passport-style photo: The image must be 2 MB or smaller.'])
      }
      return
    }
    try {
      const formData = new FormData()
      formData.set('data', JSON.stringify(values))
      formData.set('passportPhoto', passportPhoto)
      if (leadershipInvite) formData.set('leadershipInviteToken', leadershipInvite.token)
      const response = await fetch('/api/membership', { method: 'POST', body: formData })
      const result = await response.json()
      if (!response.ok) {
        if (result.details) {
          const details = Object.entries(result.details as Record<string, string[]>).flatMap(([field, messages]) => {
            const label = membershipFieldLabels[field as keyof MembershipInput] ?? field
            return messages?.[0] ? [`${label}: ${messages[0]}`] : []
          })
          setValidationMessage(details.length ? 'Please check the following before submitting:' : 'The server could not validate the form. Please review your entries and try again.')
          setValidationDetails(details)
          for (const [field, messages] of Object.entries(result.details as Record<string, string[]>)) {
            if (messages?.[0]) setError(field as keyof MembershipInput, { type: 'server', message: messages[0] })
          }
          return
        }
        setServerError(result.error ?? 'Registration failed. Please try again.')
        return
      }
      setSuccess({ memberId: result.memberId, emailSent: result.emailSent })
    } catch {
      setServerError('We could not reach the server. Please check your connection and try again.')
    }
  }

  if (success) return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 sm:p-9" role="status">
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-100"><CheckCircle2 className="size-7 text-emerald-700" /></span>
      <div className="mt-5 text-center"><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">Registration complete</p><h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em] text-brand-ink">Welcome to KAMP</h2><p className="mt-2 text-sm leading-relaxed text-brand-grey">Your membership is active. Keep this member ID for your records.</p></div>
      <p className="mt-5 rounded-xl border border-emerald-200 bg-white px-4 py-4 text-center font-mono text-lg font-bold tracking-wide text-brand-ink sm:text-xl">{success.memberId}</p>
      <p className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-brand-grey"><ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-emerald-700" />{success.emailSent ? 'Your membership card and welcome message are on their way by email.' : 'Your membership is saved, but we could not send the email. Please contact KAMP with your member ID.'}</p>
    </div>
  )

  const errorFor = (name: keyof MembershipInput) => errors[name]?.message && <p className="mt-1 text-sm text-red-700" role="alert">{errors[name]?.message}</p>

  return (
    <form
      onSubmit={handleSubmit(submit, handleInvalidSubmit)}
      onChange={() => {
        if (validationMessage) {
          setValidationMessage('')
          setValidationDetails([])
        }
      }}
      noValidate
      aria-busy={isSubmitting}
      className="space-y-7"
    >
      <div className="flex items-center justify-between gap-3 border-b border-brand-card pb-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-ink/55">{leadershipInvite ? 'Leadership membership application' : 'Membership application'}</p><p className="mt-1 text-xs text-brand-grey">Fields marked <span className="font-bold text-brand-gold">*</span> are required</p></div><span className="rounded-full bg-brand-cream px-3 py-1.5 text-[11px] font-semibold text-brand-ink">KAMP</span></div>

      {validationMessage && (
        <div
          ref={validationSummaryRef}
          tabIndex={-1}
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-relaxed text-red-800 focus:outline-2 focus:outline-offset-2 focus:outline-red-500"
        >
          {validationMessage}
          {validationDetails.length > 0 && (
            <ul className="mt-2 list-inside list-disc space-y-1">
              {validationDetails.map((detail) => <li key={detail}>{detail}</li>)}
            </ul>
          )}
        </div>
      )}

      <section aria-labelledby="membership-personal-heading" className="space-y-5">
        <div><h3 id="membership-personal-heading" className="font-display text-lg font-semibold tracking-[-0.02em] text-brand-ink">About you</h3><p className="mt-1 text-xs leading-relaxed text-brand-grey">Your contact details and membership category.</p></div>
        <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
          <label className="block text-sm font-medium text-brand-ink">First name <span className="text-brand-gold">*</span><input autoComplete="given-name" className={inputClass(!!errors.firstName)} {...register('firstName')} aria-invalid={!!errors.firstName} />{errorFor('firstName')}</label>
          <label className="block text-sm font-medium text-brand-ink">Last name <span className="text-brand-gold">*</span><input autoComplete="family-name" className={inputClass(!!errors.lastName)} {...register('lastName')} aria-invalid={!!errors.lastName} />{errorFor('lastName')}</label>
          <label className="block text-sm font-medium text-brand-ink">Email address <span className="text-brand-gold">*</span><input type="email" autoComplete="email" readOnly={!!leadershipInvite} className={`${inputClass(!!errors.email)} ${leadershipInvite ? 'bg-brand-cream/60' : ''}`} {...register('email')} aria-invalid={!!errors.email} />{leadershipInvite && <span className="mt-1 block text-xs font-normal text-brand-grey">This invitation is assigned to this email address.</span>}{errorFor('email')}</label>
          <label className="block text-sm font-medium text-brand-ink">Phone number <span className="text-brand-gold">*</span><input type="tel" autoComplete="tel" className={inputClass(!!errors.phone)} {...register('phone')} aria-invalid={!!errors.phone} />{errorFor('phone')}</label>
          <label className="block text-sm font-medium text-brand-ink">Membership category <span className="text-brand-gold">*</span><select className={inputClass(!!errors.membershipType)} {...register('membershipType')}><option value="student">Student</option><option value="professional">Professional</option><option value="non_professional">Non-professional</option></select>{errorFor('membershipType')}</label>
          <label className="block text-sm font-medium text-brand-ink">Date of birth <span className="text-brand-gold">*</span><input type="date" autoComplete="bday" className={inputClass(!!errors.dateOfBirth)} {...register('dateOfBirth')} aria-invalid={!!errors.dateOfBirth} />{errorFor('dateOfBirth')}</label>
        </div>
      </section>

      <section aria-labelledby="membership-background-heading" className="space-y-5 border-t border-brand-card pt-6">
        <div><h3 id="membership-background-heading" className="font-display text-lg font-semibold tracking-[-0.02em] text-brand-ink">Your background</h3><p className="mt-1 text-xs leading-relaxed text-brand-grey">Help us understand your current path.</p></div>
        {membershipType === 'student' ? <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
          <label className="block text-sm font-medium text-brand-ink sm:col-span-2">Tertiary institution <span className="text-brand-gold">*</span><Controller name="university" control={control} render={({ field }) => <InstitutionCombobox name="university" defaultValue={field.value ?? ''} onValueChange={field.onChange} required inputClassName={inputClass(!!errors.university)} />} />{errorFor('university')}</label>
          <label className="block text-sm font-medium text-brand-ink">Study level <span className="text-brand-gold">*</span><select className={inputClass(!!errors.studyLevel)} defaultValue="" {...register('studyLevel')}><option value="" disabled>Select your current level</option>{studyLevels.map((level) => <option key={level}>{level}</option>)}</select>{errorFor('studyLevel')}</label>
        </div> : <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
          <label className="block text-sm font-medium text-brand-ink">{membershipType === 'professional' ? 'Profession or role' : 'Current activity'} <span className="text-brand-gold">*</span><input className={inputClass(!!errors.occupation)} maxLength={120} placeholder={membershipType === 'professional' ? 'e.g. Teacher, Engineer, Consultant' : 'e.g. Job seeker, Entrepreneur, Volunteer'} {...register('occupation')} aria-invalid={!!errors.occupation} />{errorFor('occupation')}</label>
          {membershipType === 'professional' && <label className="block text-sm font-medium text-brand-ink">Organization <span className="font-normal text-brand-grey">(optional)</span><input className={inputClass(!!errors.organization)} maxLength={160} placeholder="Employer or organization" {...register('organization')} aria-invalid={!!errors.organization} />{errorFor('organization')}</label>}
        </div>}
        <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
          <label className="block text-sm font-medium text-brand-ink">Gender <span className="text-brand-gold">*</span><select className={inputClass(!!errors.gender)} defaultValue="" {...register('gender')}><option value="" disabled>Select</option><option>Female</option><option>Male</option></select>{errorFor('gender')}</label>
          <label className="block text-sm font-medium text-brand-ink">State of origin <span className="text-brand-gold">*</span><select className={inputClass(!!errors.stateOfOrigin)} defaultValue="" {...register('stateOfOrigin')}><option value="" disabled>Select</option>{NIGERIAN_STATES.map((state) => <option key={state}>{state}</option>)}</select>{errorFor('stateOfOrigin')}</label>
        </div>
        {leadershipInvite ? <div className="rounded-xl border border-brand-gold/30 bg-brand-cream p-4"><p className="text-xs font-semibold uppercase tracking-widest text-brand-grey">Approved KAMP position</p><p className="mt-1 font-semibold text-brand-ink">{leadershipInvite.role}</p><p className="mt-1 text-xs text-brand-grey">This role and its member ID are set by your private invitation.</p></div> : <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
          <label className="block text-sm font-medium text-brand-ink">Position in KAMP <span className="text-brand-gold">*</span><select className={inputClass(!!errors.kampPosition)} {...register('kampPosition')}>{KAMP_POSITIONS.map((position) => <option key={position} value={position}>{position}</option>)}</select>{errorFor('kampPosition')}<span className="mt-1 block text-xs font-normal leading-relaxed text-brand-grey">Choose a role assigned to you by KAMP. Select General Member if you do not hold a KAMP position.</span></label>
          {kampPosition === 'Other KAMP role' && <label className="block text-sm font-medium text-brand-ink">Other KAMP role <span className="text-brand-gold">*</span><input maxLength={80} placeholder="Enter your assigned KAMP role" className={inputClass(!!errors.kampPositionOther)} {...register('kampPositionOther')} aria-invalid={!!errors.kampPositionOther} />{errorFor('kampPositionOther')}</label>}
        </div>}
      </section>

      <section aria-labelledby="membership-finish-heading" className="space-y-5 border-t border-brand-card pt-6">
        <div><h3 id="membership-finish-heading" className="font-display text-lg font-semibold tracking-[-0.02em] text-brand-ink">Finish your application</h3><p className="mt-1 text-xs leading-relaxed text-brand-grey">Your photo will appear on your KAMP membership card.</p></div>
        <label className="block text-sm font-medium text-brand-ink">Passport-style photo <span className="text-brand-gold">*</span><span className="block text-xs font-normal text-brand-grey">JPG or PNG, up to 2 MB</span><input type="file" accept="image/jpeg,image/png" required className={`${inputClass(!!photoError)} file:mr-3 file:rounded-full file:border-0 file:bg-brand-ink file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white`} onChange={(event) => { const file = event.target.files?.[0] ?? null; setPassportPhoto(file); setPhotoError(file && file.size > 2 * 1024 * 1024 ? 'Photo must be 2 MB or smaller.' : ''); }} aria-invalid={!!photoError} />{passportPhoto && !photoError && <span className="mt-2 block truncate text-xs text-brand-grey">Selected: {passportPhoto.name}</span>}{photoError && <p className="mt-1 text-sm text-red-700" role="alert">{photoError}</p>}</label>
        <label className="block text-sm font-medium text-brand-ink">Why do you want to join KAMP? <span className="text-brand-gold">*</span><textarea rows={4} maxLength={500} className={`${inputClass(!!errors.whyJoin)} min-h-28 resize-y`} {...register('whyJoin')} aria-invalid={!!errors.whyJoin} /><span className="mt-1 block text-right text-xs text-brand-grey">{whyJoin.length}/500</span>{errorFor('whyJoin')}</label>
      </section>

      {serverError && <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-relaxed text-red-800" role="alert">{serverError}</p>}
      <div className="border-t border-brand-card pt-6">
        <button type="submit" disabled={isSubmitting} className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-ink px-6 py-3.5 font-semibold text-white transition-colors hover:bg-brand-black focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brand-ink active:scale-[0.99] disabled:cursor-wait disabled:opacity-60 motion-reduce:transition-none motion-reduce:active:scale-100 sm:w-auto">
          {isSubmitting ? <><LoaderCircle aria-hidden="true" className="size-4 animate-spin" />Submitting…</> : <>Submit application <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" /></>}
        </button>
        <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-brand-grey"><ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-ink/65" />By applying, you agree that KAMP may use these details to manage your membership and contact you about the community.</p>
      </div>
    </form>
  )
}
