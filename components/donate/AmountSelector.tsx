'use client'

// Selects a preset or custom KAMP donation amount.
const amounts = [1000, 5000, 10000, 25000, 50000]

type AmountSelectorProps = {
  amount: string
  onAmountChange: (amount: string) => void
  /** True while the parent is mid-submit, so the controls lock rather than letting
      the donor change the figure after checkout has been requested. */
  disabled?: boolean
}

export default function AmountSelector({ amount, onAmountChange, disabled = false }: AmountSelectorProps) {
  // The custom field is shown whenever the current amount is not one of the presets,
  // which also keeps it open across a re-render after the donor types into it.
  const isPreset = amounts.some((value) => String(value) === amount)

  return (
    <div>
      <p className="text-sm font-semibold">Choose an amount</p>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {amounts.map((value) => (
          <button key={value} type="button" disabled={disabled} onClick={() => onAmountChange(String(value))} className={`rounded-xl border px-4 py-3 text-sm font-semibold transition disabled:opacity-60 ${amount === String(value) ? 'border-brand-gold bg-brand-gold text-brand-black' : 'border-brand-ink/20 bg-brand-white text-brand-ink hover:border-brand-gold'}`}>
            ₦{value.toLocaleString('en-NG')}
          </button>
        ))}
        <button type="button" disabled={disabled} onClick={() => onAmountChange('')} className={`rounded-xl border px-4 py-3 text-sm font-semibold transition disabled:opacity-60 ${!isPreset ? 'border-brand-gold bg-brand-gold text-brand-black' : 'border-brand-ink/20 bg-brand-white text-brand-ink hover:border-brand-gold'}`}>
          Other amount
        </button>
      </div>
      {!isPreset && (
        <label className="mt-4 block text-sm font-medium">Custom amount
          <div className="mt-2 flex items-center rounded-xl border border-brand-ink/20 bg-brand-white px-4 focus-within:border-brand-gold"><span className="text-brand-grey">₦</span><input type="number" min="100" inputMode="numeric" autoFocus value={amount} disabled={disabled} onChange={(event) => onAmountChange(event.target.value)} placeholder="Enter an amount" className="w-full bg-transparent px-2 py-3 outline-none" /></div>
        </label>
      )}
    </div>
  )
}
