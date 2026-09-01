'use client'

// Handles KAMP's donation choices and donor details, then hands the donor off to
// Paystack's hosted checkout. There is no local success state: /api/donate records
// a pending row and returns a checkout URL, and Paystack redirects back to
// /donate/success once payment completes.
import { CreditCard, Landmark, ShieldCheck, Smartphone } from 'lucide-react'
import { FormEvent, useState } from 'react'
import AmountSelector from './AmountSelector'

type Frequency = 'one-time' | 'monthly'
type PaymentMethod = 'card' | 'transfer' | 'ussd'

// donationSchema in lib/validations.ts uses snake_case values, and the donations
// table has a CHECK constraint on exactly these two.
const DONATION_TYPE: Record<Frequency, 'one_time' | 'recurring'> = {
  'one-time': 'one_time',
  monthly: 'recurring',
}

// Presentational only. Paystack's checkout page offers card, transfer and USSD
// itself, so this pre-selection is a hint to the donor rather than a parameter —
// /api/donate does not take a channel.
const paymentMethods: { id: PaymentMethod; label: string; icon: typeof CreditCard }[] = [
  { id: 'card', label: 'Card', icon: CreditCard },
  { id: 'transfer', label: 'Bank transfer', icon: Landmark },
  { id: 'ussd', label: 'USSD', icon: Smartphone },
]

const MINIMUM_NGN = 100

export default function DonateForm() {
  const [amount, setAmount] = useState('10000')
  const [frequency, setFrequency] = useState<Frequency>('one-time')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const submitDonation = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const form = new FormData(event.currentTarget)
    const amountNgn = Number(amount)

    // Zod enforces the same floor server-side; this saves a round trip and gives
    // the donor the message next to the field they need to change.
    if (!Number.isFinite(amountNgn) || amountNgn < MINIMUM_NGN) {
      setStatus('error')
      setErrorMessage(`Minimum donation is ₦${MINIMUM_NGN.toLocaleString('en-NG')}.`)
      return
    }

    setErrorMessage(null)
    setStatus('loading')

    try {
      const response = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorName: form.get('name'),
          donorEmail: form.get('email'),
          amountNgn,
          donationType: DONATION_TYPE[frequency],
          message: (form.get('message') as string) || undefined,
        }),
      })

      const payload = await response.json().catch(() => null)

      if (!response.ok) {
        setStatus('error')
        setErrorMessage(payload?.error ?? 'Payment initialisation failed.')
        return
      }

      // Redirect to Paystack checkout — the donor leaves the site here, so the
      // button deliberately stays in its loading state until navigation happens.
      window.location.href = payload.authorizationUrl
    } catch {
      setStatus('error')
      setErrorMessage('Network error. Please check your connection and try again.')
    }
  }

  const submitting = status === 'loading'

  return (
    <form onSubmit={submitDonation} className="rounded-2xl bg-brand-card p-6 md:p-8">
      {status === 'error' && errorMessage && (
        <div role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{errorMessage}</div>
      )}

      <div className="grid grid-cols-2 rounded-full bg-brand-white p-1">
        {(['one-time', 'monthly'] as const).map((option) => <button key={option} type="button" disabled={submitting} onClick={() => setFrequency(option)} className={`rounded-full px-4 py-2.5 text-sm font-semibold capitalize transition disabled:opacity-60 ${frequency === option ? 'bg-brand-ink text-brand-white' : 'text-brand-grey'}`}>{option === 'one-time' ? 'One-time' : 'Monthly'}</button>)}
      </div>

      <div className="mt-7"><AmountSelector amount={amount} onAmountChange={setAmount} disabled={submitting} /></div>
      <fieldset className="mt-8" disabled={submitting}><legend className="text-sm font-semibold">Your details</legend><div className="mt-3 grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium">Full name<input required name="name" className="mt-2 w-full rounded-xl border border-brand-ink/20 bg-brand-white px-4 py-3 outline-none focus:border-brand-gold" /></label>
        <label className="text-sm font-medium">Email address<input required name="email" type="email" className="mt-2 w-full rounded-xl border border-brand-ink/20 bg-brand-white px-4 py-3 outline-none focus:border-brand-gold" /></label>
        <label className="text-sm font-medium md:col-span-2">A message of support <span className="font-normal text-brand-grey">(optional)</span><textarea name="message" rows={3} maxLength={500} className="mt-2 w-full resize-none rounded-xl border border-brand-ink/20 bg-brand-white px-4 py-3 outline-none focus:border-brand-gold" placeholder="Tell us why this work matters to you" /></label>
      </div></fieldset>

      <fieldset className="mt-8" disabled={submitting}><legend className="text-sm font-semibold">Payment method</legend><div className="mt-3 grid gap-3 sm:grid-cols-3">
        {paymentMethods.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setPaymentMethod(id)} className={`flex items-center gap-3 rounded-xl border p-4 text-left text-sm font-semibold transition disabled:opacity-60 ${paymentMethod === id ? 'border-brand-gold bg-brand-white' : 'border-brand-ink/15 bg-brand-white/60 hover:border-brand-gold'}`}><Icon className="size-5 text-brand-gold" strokeWidth={1.8} />{label}</button>)}
      </div></fieldset>

      <button type="submit" disabled={submitting || !amount || Number(amount) < MINIMUM_NGN} className="mt-8 w-full rounded-full bg-brand-gold px-6 py-3.5 text-sm font-semibold text-brand-black transition hover:bg-brand-gold/85 disabled:cursor-not-allowed disabled:opacity-50">
        {submitting ? <span className="inline-flex items-center gap-2"><span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />Processing...</span> : 'Continue to secure checkout'}
      </button>
      <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-brand-grey"><ShieldCheck className="size-4 text-brand-gold" />Your payment is securely processed by our Nigerian payment partner.</p>
    </form>
  )
}
