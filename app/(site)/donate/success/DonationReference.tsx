'use client'

// Reads Paystack's ?reference= off the URL. Isolated into its own client component
// so the Suspense boundary in page.tsx only has to cover this line of text — the
// rest of the confirmation is static and ships in the initial HTML.
import { useSearchParams } from 'next/navigation'

export default function DonationReference() {
  const params = useSearchParams()
  const reference = params.get('reference')

  if (!reference) return null

  return (
    <p className="mt-6 text-sm text-brand-grey">
      Reference: <span className="font-mono font-semibold text-brand-ink">{reference}</span>
    </p>
  )
}
