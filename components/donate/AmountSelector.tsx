'use client'

// Selects a preset or custom KAMP donation amount.
const amounts = [5000, 10000, 25000, 50000]

type AmountSelectorProps = {
  amount: string
  onAmountChange: (amount: string) => void
}

export default function AmountSelector({ amount, onAmountChange }: AmountSelectorProps) {
  return (
    <div>
      <p className="text-sm font-semibold">Choose an amount</p>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {amounts.map((value) => (
          <button key={value} type="button" onClick={() => onAmountChange(String(value))} className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${amount === String(value) ? 'border-brand-gold bg-brand-gold text-brand-black' : 'border-brand-ink/20 bg-brand-white text-brand-ink hover:border-brand-gold'}`}>
            ₦{value.toLocaleString('en-NG')}
          </button>
        ))}
      </div>
      <label className="mt-4 block text-sm font-medium">Custom amount
        <div className="mt-2 flex items-center rounded-xl border border-brand-ink/20 bg-brand-white px-4 focus-within:border-brand-gold"><span className="text-brand-grey">₦</span><input type="number" min="100" inputMode="numeric" value={amount} onChange={(event) => onAmountChange(event.target.value)} placeholder="Enter an amount" className="w-full bg-transparent px-2 py-3 outline-none" /></div>
      </label>
    </div>
  )
}
