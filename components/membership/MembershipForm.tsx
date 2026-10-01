'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, LoaderCircle } from 'lucide-react'
import InstitutionCombobox from '@/components/ui/InstitutionCombobox'
import { membershipSchema, NIGERIAN_STATES, type MembershipInput } from '@/lib/validations'

const studyLevels = ['100L', '200L', '300L', '400L', '500L', 'Postgraduate', 'Other'] as const
const inputClass = 'mt-2 w-full rounded-lg border border-brand-ink/20 bg-white px-4 py-3 text-brand-ink outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20'

export default function MembershipForm() {
  const [success, setSuccess] = useState<{ memberId: string; emailSent: boolean } | null>(null)
  const [serverError, setServerError] = useState('')
  const [passportPhoto, setPassportPhoto] = useState<File | null>(null)
  const [photoError, setPhotoError] = useState('')
  const { register, control, handleSubmit, watch, setError, formState: { errors, isSubmitting } } = useForm<MembershipInput>({
    resolver: zodResolver(membershipSchema), mode: 'onBlur',
    defaultValues: { firstName: '', lastName: '', email: '', phone: '', university: '', gender: undefined, stateOfOrigin: undefined, studyLevel: undefined, whyJoin: '' },
  })
  const whyJoin = watch('whyJoin') ?? ''

  async function submit(values: MembershipInput) {
    setServerError('')
    if (!passportPhoto || photoError || passportPhoto.size > 2 * 1024 * 1024) {
      if (!passportPhoto) setPhotoError('Please add a passport-style photo.')
      else if (passportPhoto.size > 2 * 1024 * 1024) setPhotoError('Photo must be 2 MB or smaller.')
      return
    }
    try {
      const formData = new FormData()
      formData.set('data', JSON.stringify(values))
      formData.set('passportPhoto', passportPhoto)
      const response = await fetch('/api/membership', { method: 'POST', body: formData })
      const result = await response.json()
      if (!response.ok) {
        if (result.details) {
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
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-7 text-center sm:p-10" role="status">
      <CheckCircle2 className="mx-auto size-12 text-emerald-700" />
      <h2 className="mt-4 font-display text-3xl font-semibold text-brand-ink">Welcome to KAMP</h2>
      <p className="mt-3 text-brand-grey">Your membership is active. Your member ID is:</p>
      <p className="mt-2 font-display text-xl font-bold text-brand-ink">{success.memberId}</p>
      <p className="mt-3 text-sm text-brand-grey">{success.emailSent ? 'Your membership card and welcome message are on their way by email.' : 'Your membership is saved, but we could not send the email. Please contact KAMP with your member ID.'}</p>
    </div>
  )

  const errorFor = (name: keyof MembershipInput) => errors[name]?.message && <p className="mt-1 text-sm text-red-700" role="alert">{errors[name]?.message}</p>

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium">First name<input autoComplete="given-name" className={inputClass} {...register('firstName')} aria-invalid={!!errors.firstName} />{errorFor('firstName')}</label>
        <label className="block text-sm font-medium">Last name<input autoComplete="family-name" className={inputClass} {...register('lastName')} aria-invalid={!!errors.lastName} />{errorFor('lastName')}</label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium">Email address<input type="email" autoComplete="email" className={inputClass} {...register('email')} aria-invalid={!!errors.email} />{errorFor('email')}</label>
        <label className="block text-sm font-medium">Phone number<input type="tel" autoComplete="tel" className={inputClass} {...register('phone')} aria-invalid={!!errors.phone} />{errorFor('phone')}</label>
      </div>
      <label className="block text-sm font-medium">Tertiary institution<Controller name="university" control={control} render={({ field }) => <InstitutionCombobox name="university" defaultValue={field.value} onValueChange={field.onChange} required />} />{errorFor('university')}</label>
      <div className="grid gap-5 sm:grid-cols-3">
        <label className="block text-sm font-medium">Gender<select className={inputClass} defaultValue="" {...register('gender')}><option value="" disabled>Select</option><option>Female</option><option>Male</option></select>{errorFor('gender')}</label>
        <label className="block text-sm font-medium">State of origin<select className={inputClass} defaultValue="" {...register('stateOfOrigin')}><option value="" disabled>Select</option>{NIGERIAN_STATES.map((state) => <option key={state}>{state}</option>)}</select>{errorFor('stateOfOrigin')}</label>
        <label className="block text-sm font-medium">Study level<select className={inputClass} defaultValue="" {...register('studyLevel')}><option value="" disabled>Select</option>{studyLevels.map((level) => <option key={level}>{level}</option>)}</select>{errorFor('studyLevel')}</label>
      </div>
      <label className="block text-sm font-medium">Passport-style photo <span className="font-normal text-brand-grey">(JPG or PNG, up to 2 MB)</span><input type="file" accept="image/jpeg,image/png" required className={`${inputClass} file:mr-4 file:rounded-full file:border-0 file:bg-brand-ink file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white`} onChange={(event) => { const file = event.target.files?.[0] ?? null; setPassportPhoto(file); setPhotoError(file && file.size > 2 * 1024 * 1024 ? 'Photo must be 2 MB or smaller.' : ''); }} aria-invalid={!!photoError} />{passportPhoto && !photoError && <span className="mt-1 block text-xs text-brand-grey">Selected: {passportPhoto.name}</span>}{photoError && <p className="mt-1 text-sm text-red-700" role="alert">{photoError}</p>}</label>
      <label className="block text-sm font-medium">Why do you want to join KAMP?<textarea rows={4} maxLength={500} className={`${inputClass} resize-y`} {...register('whyJoin')} aria-invalid={!!errors.whyJoin} /><span className="mt-1 block text-right text-xs text-brand-grey">{whyJoin.length}/500</span>{errorFor('whyJoin')}</label>
      {serverError && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-800" role="alert">{serverError}</p>}
      <button type="submit" disabled={isSubmitting} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-ink px-6 py-3.5 font-semibold text-white transition hover:bg-brand-black disabled:cursor-wait disabled:opacity-60 sm:w-auto">
        {isSubmitting && <LoaderCircle className="size-4 animate-spin" />}{isSubmitting ? 'Submitting…' : 'Become a member'}
      </button>
      <p className="text-xs leading-relaxed text-brand-grey">By applying, you agree that KAMP may use these details to manage your membership and contact you about the community.</p>
    </form>
  )
}
