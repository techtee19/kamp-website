'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { leaderReportSchema, type LeaderReportInput } from '@/lib/leader-validations'
const field = 'mt-1.5 w-full rounded-xl border border-black/10 bg-white px-3.5 py-3 text-sm outline-none transition placeholder:text-black/35 focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/15'
const label = 'block text-sm font-medium text-black/75'
export default function LeaderReportForm() {
  const router = useRouter()
  const [notice, setNotice] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LeaderReportInput>({ resolver: zodResolver(leaderReportSchema), defaultValues: { reportType: 'monthly' } })
  const submit = handleSubmit(async (values) => {
    setNotice('')
    const response = await fetch('/leaders/api/reports', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...values, eventsHeld: values.eventsHeld === undefined || Number.isNaN(values.eventsHeld) ? undefined : values.eventsHeld, attendance: values.attendance === undefined || Number.isNaN(values.attendance) ? undefined : values.attendance }) })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Could not submit report.')
    router.push(`/leaders/reports/${data.id}`)
  }, (invalid) => { const first = Object.values(invalid)[0]; setNotice(first?.message ?? 'Please check the highlighted fields.') })
  return <form onSubmit={(event) => { void submit(event).catch((error) => setNotice(error instanceof Error ? error.message : 'Could not submit report.')) }} className="space-y-5">
    {notice && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{notice}</p>}
    <div className="grid gap-5 sm:grid-cols-2"><label className={label}>Report type<select {...register('reportType')} className={field}><option value="monthly">Monthly update</option><option value="event">Event report</option><option value="other">Other</option></select></label><label className={label}>Report date<input type="date" {...register('reportDate')} className={field} />{errors.reportDate && <small className="text-red-600">{errors.reportDate.message}</small>}</label></div>
    <label className={label}>Title<input maxLength={200} placeholder="e.g. October campus update" {...register('title')} className={field} />{errors.title && <small className="text-red-600">{errors.title.message}</small>}</label>
    <div className="grid gap-5 sm:grid-cols-2"><label className={label}>Events held (optional)<input type="number" min="0" {...register('eventsHeld', { setValueAs: (v) => v === '' ? undefined : Number(v) })} className={field} /></label><label className={label}>Attendance (optional)<input type="number" min="0" {...register('attendance', { setValueAs: (v) => v === '' ? undefined : Number(v) })} className={field} /></label></div>
    <label className={label}>Summary<textarea rows={5} maxLength={5000} {...register('summary')} className={field} />{errors.summary && <small className="text-red-600">{errors.summary.message}</small>}</label>
    <div className="grid gap-5 sm:grid-cols-2"><label className={label}>Achievements<textarea rows={3} {...register('achievements')} className={field} /></label><label className={label}>Challenges<textarea rows={3} {...register('challenges')} className={field} /></label></div>
    <label className={label}>Next steps<textarea rows={3} {...register('nextSteps')} className={field} /></label><label className={label}>Links or supporting material<input maxLength={2000} placeholder="https://…" {...register('links')} className={field} /></label>
    <button disabled={isSubmitting} className="rounded-full bg-brand-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-black/80 disabled:opacity-60 motion-reduce:transition-none">{isSubmitting ? 'Submitting…' : 'Submit report'}</button>
  </form>
}
