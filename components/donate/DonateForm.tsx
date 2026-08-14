'use client'

// Handles KAMP's donation choices, donor details, and confirmation state.
import { CreditCard, Landmark, ShieldCheck, Smartphone } from 'lucide-react'
import { FormEvent, useState } from 'react'
import AmountSelector from './AmountSelector'

type Frequency = 'one-time' | 'monthly'
type PaymentMethod = 'card' | 'transfer' | 'ussd'

const paymentMethods: { id: PaymentMethod; label: string; icon: typeof CreditCard }[] = [
  { id: 'card', label: 'Card', icon: CreditCard },
  { id: 'transfer', label: 'Bank transfer', icon: Landmark },
  { id: 'ussd', label: 'USSD', icon: Smartphone },
]

export default function DonateForm() {
  const [amount, setAmount] = useState('10000')
  const [frequency, setFrequency] = useState<Frequency>('one-time')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')
  const [confirmed, setConfirmed] = useState(false)

  const submitDonation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setConfirmed(true)
  }

  if (confirmed) {
    return (
      <div className="rounded-2xl border-l-4 border-brand-gold bg-brand-card p-8 md:p-10">
        <ShieldCheck className="size-10 text-brand-gold" strokeWidth={1.7} />
        <p className="mt-5 font-display text-3xl font-semibold">Thank you for giving.</p>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-brand-grey">Your {frequency === 'monthly' ? 'monthly ' : ''}donation of ₦{Number(amount || 0).toLocaleString('en-NG')} has been received. We&apos;ll send your confirmation and payment receipt to your email.</p>
        <button type="button" onClick={() => setConfirmed(false)} className="mt-7 rounded-full bg-brand-ink px-6 py-3 text-sm text-brand-white">Make another donation</button>
      </div>
    )
  }

  return (
    <form onSubmit={submitDonation} className="rounded-2xl bg-brand-card p-6 md:p-8">
      <div className="grid grid-cols-2 rounded-full bg-brand-white p-1">
        {(['one-time', 'monthly'] as const).map((option) => <button key={option} type="button" onClick={() => setFrequency(option)} className={`rounded-full px-4 py-2.5 text-sm font-semibold capitalize transition ${frequency === option ? 'bg-brand-ink text-brand-white' : 'text-brand-grey'}`}>{option === 'one-time' ? 'One-time' : 'Monthly'}</button>)}
      </div>

      <div className="mt-7"><AmountSelector amount={amount} onAmountChange={setAmount} /></div>
      <fieldset className="mt-8"><legend className="text-sm font-semibold">Your details</legend><div className="mt-3 grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium">Full name<input required name="name" className="mt-2 w-full rounded-xl border border-brand-ink/20 bg-brand-white px-4 py-3 outline-none focus:border-brand-gold" /></label>
        <label className="text-sm font-medium">Email address<input required name="email" type="email" className="mt-2 w-full rounded-xl border border-brand-ink/20 bg-brand-white px-4 py-3 outline-none focus:border-brand-gold" /></label>
        <label className="text-sm font-medium md:col-span-2">A message of support <span className="font-normal text-brand-grey">(optional)</span><textarea name="message" rows={3} className="mt-2 w-full resize-none rounded-xl border border-brand-ink/20 bg-brand-white px-4 py-3 outline-none focus:border-brand-gold" placeholder="Tell us why this work matters to you" /></label>
      </div></fieldset>

      <fieldset className="mt-8"><legend className="text-sm font-semibold">Payment method</legend><div className="mt-3 grid gap-3 sm:grid-cols-3">
        {paymentMethods.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setPaymentMethod(id)} className={`flex items-center gap-3 rounded-xl border p-4 text-left text-sm font-semibold transition ${paymentMethod === id ? 'border-brand-gold bg-brand-white' : 'border-brand-ink/15 bg-brand-white/60 hover:border-brand-gold'}`}><Icon className="size-5 text-brand-gold" strokeWidth={1.8} />{label}</button>)}
      </div></fieldset>

      <button type="submit" disabled={!amount || Number(amount) < 100} className="mt-8 w-full rounded-full bg-brand-gold px-6 py-3.5 text-sm font-semibold text-brand-black transition hover:bg-brand-gold/85 disabled:cursor-not-allowed disabled:opacity-50">Continue to secure checkout</button>
      <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-brand-grey"><ShieldCheck className="size-4 text-brand-gold" />Your payment is securely processed by our Nigerian payment partner.</p>
    </form>
  )
}
