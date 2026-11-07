'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { leaderRequestSchema, type LeaderRequestInput } from '@/lib/leader-validations'
import LeaderSelect from '@/components/leaders/LeaderSelect'
const field = 'mt-1.5 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-black/35 hover:border-brand-ink/25 focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/15 motion-reduce:transition-none'
const label = 'block text-sm font-medium text-black/75'
export default function LeaderRequestForm() {
  const router = useRouter()
  const [notice, setNotice] = useState('')
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<LeaderRequestInput>({ resolver: zodResolver(leaderRequestSchema), defaultValues: { requestType: 'support' } })
  const requestType = useWatch({ control, name: 'requestType' })
  const submit = handleSubmit(async (values) => {
    setNotice('')
    const response = await fetch('/leaders/api/requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...values, amountRequested: Number.isFinite(values.amountRequested) ? values.amountRequested : undefined }) })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Could not submit request.')
    router.push(`/leaders/requests/${data.id}`)
  }, (invalid) => { const first = Object.values(invalid)[0]; setNotice(first?.message ?? 'Please check the highlighted fields.') })
  return <form onSubmit={(event) => { void submit(event).catch((error) => setNotice(error instanceof Error ? error.message : 'Could not submit request.')) }} className="space-y-5">
    {notice && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{notice}</p>}
    <section className="rounded-2xl bg-brand-cream/75 p-4 sm:p-5"><p className="mb-4 text-[10px] font-semibold uppercase tracking-[.18em] text-brand-ink/65">01 · What kind of support?</p><Controller control={control} name="requestType" render={({ field: controlField }) => <LeaderSelect label="Request type" value={controlField.value} onChange={controlField.onChange} options={[{ value: 'support', label: 'General support', detail: 'Coordination, guidance, or team support' }, { value: 'funding', label: 'Funding', detail: 'A budgeted request for an activity' }, { value: 'materials', label: 'Materials', detail: 'Equipment, supplies, or printed resources' }, { value: 'approval', label: 'Approval', detail: 'Permission to proceed with an initiative' }, { value: 'other', label: 'Other request', detail: 'Something not covered by the options' }]} />} /><label className={`${label} mt-5`}>Give your request a title<input maxLength={200} placeholder="e.g. Materials for our mentoring session" {...register('title')} className={field} />{errors.title && <small className="text-red-600">{errors.title.message}</small>}</label></section>
    <section className="rounded-2xl border border-black/[.06] bg-white p-4 sm:p-5"><p className="mb-4 text-[10px] font-semibold uppercase tracking-[.18em] text-brand-ink/65">02 · Tell us more</p><label className={label}>What do you need, and how will it help?<textarea rows={5} maxLength={5000} placeholder="Describe the need, who it will support, and the outcome you’re working toward." {...register('description')} className={field} />{errors.description && <small className="text-red-600">{errors.description.message}</small>}</label>
    {(requestType === 'funding' || requestType === 'approval') && <div className="mt-5 grid gap-5 sm:grid-cols-2"><label className={label}>Event or activity name<input maxLength={200} {...register('eventName')} className={field} /></label><label className={label}>Event date<input type="date" {...register('eventDate')} className={field} /></label></div>}
    {requestType === 'funding' && <div className="mt-5 rounded-2xl border border-brand-gold/30 bg-brand-gold/10 p-4"><p className="mb-4 text-xs font-semibold text-brand-ink">Funding details <span className="font-normal text-black/55">· Include enough detail for the team to review your budget.</span></p><div className="grid gap-5 sm:grid-cols-2"><label className={label}>Amount requested (₦)<input type="number" min="1" step="0.01" placeholder="0.00" {...register('amountRequested', { setValueAs: (v) => v === '' ? undefined : Number(v) })} className={field} />{errors.amountRequested && <small className="text-red-600">{errors.amountRequested.message}</small>}</label><label className={label}>Budget breakdown<textarea rows={3} placeholder="List the main costs" {...register('budgetBreakdown')} className={field} />{errors.budgetBreakdown && <small className="text-red-600">{errors.budgetBreakdown.message}</small>}</label></div></div>}</section>
    <section className="grid gap-5 rounded-2xl border border-black/[.06] bg-white p-4 sm:grid-cols-2 sm:p-5"><label className={label}>Needed by <span className="font-normal text-black/40">· optional</span><input type="date" {...register('neededBy')} className={field} /></label><label className={label}>Supporting link <span className="font-normal text-black/40">· optional</span><input placeholder="https://…" {...register('links')} className={field} /></label></section>
    <button disabled={isSubmitting} className="w-full rounded-full bg-brand-black px-6 py-3.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(32,32,32,.12)] transition hover:bg-brand-ink active:scale-[.99] disabled:opacity-60 sm:w-auto motion-reduce:transition-none">{isSubmitting ? 'Submitting request…' : 'Submit request'} <span aria-hidden="true" className="ml-2 text-brand-gold">↗</span></button>
  </form>
}
