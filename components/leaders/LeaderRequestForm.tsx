'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { leaderRequestSchema, type LeaderRequestInput } from '@/lib/leader-validations'
const field = 'mt-1.5 w-full rounded-xl border border-black/10 bg-white px-3.5 py-3 text-sm outline-none transition placeholder:text-black/35 focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/15'
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
    <div className="grid gap-5 sm:grid-cols-2"><label className={label}>Request type<select {...register('requestType')} className={field}><option value="support">General support</option><option value="funding">Funding</option><option value="materials">Materials</option><option value="approval">Approval</option><option value="other">Other</option></select></label><label className={label}>Title<input maxLength={200} {...register('title')} className={field} />{errors.title && <small className="text-red-600">{errors.title.message}</small>}</label></div>
    <label className={label}>What do you need?<textarea rows={5} maxLength={5000} {...register('description')} className={field} />{errors.description && <small className="text-red-600">{errors.description.message}</small>}</label>
    {(requestType === 'funding' || requestType === 'approval') && <div className="grid gap-5 sm:grid-cols-2"><label className={label}>Event or activity name<input maxLength={200} {...register('eventName')} className={field} /></label><label className={label}>Event date<input type="date" {...register('eventDate')} className={field} /></label></div>}
    {requestType === 'funding' && <div className="grid gap-5 sm:grid-cols-2"><label className={label}>Amount requested (₦)<input type="number" min="1" step="0.01" {...register('amountRequested', { setValueAs: (v) => v === '' ? undefined : Number(v) })} className={field} />{errors.amountRequested && <small className="text-red-600">{errors.amountRequested.message}</small>}</label><label className={label}>Budget breakdown<textarea rows={3} {...register('budgetBreakdown')} className={field} />{errors.budgetBreakdown && <small className="text-red-600">{errors.budgetBreakdown.message}</small>}</label></div>}
    <div className="grid gap-5 sm:grid-cols-2"><label className={label}>Needed by (optional)<input type="date" {...register('neededBy')} className={field} /></label><label className={label}>Links or supporting material<input placeholder="https://…" {...register('links')} className={field} /></label></div>
    <button disabled={isSubmitting} className="rounded-full bg-brand-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-black/80 disabled:opacity-60 motion-reduce:transition-none">{isSubmitting ? 'Submitting…' : 'Submit request'}</button>
  </form>
}
