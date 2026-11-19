'use client'

import { useState } from 'react'
import { Copy, Check, ArrowUpRight } from 'lucide-react'

export default function SupportWhatsAppNumber({ number }: { number: string }) {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  async function copy() {
    try {
      await navigator.clipboard.writeText(number)
      setCopied(true)
      setError('')
    } catch {
      setError('Select and copy the number shown above.')
    }
  }

  return <div className="space-y-3">
    <p className="select-all font-mono text-lg font-semibold text-brand-ink">{number}</p>
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" onClick={copy} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-brand-ink/15 bg-white px-4 py-2 text-sm font-semibold">
        {copied ? <Check aria-hidden="true" className="size-4" /> : <Copy aria-hidden="true" className="size-4" />}
        {copied ? 'Number copied' : 'Copy number'}
      </button>
      <a href={`https://wa.me/${number.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[#176B42] underline underline-offset-4">
        Chat on WhatsApp <ArrowUpRight aria-hidden="true" className="size-4" />
      </a>
    </div>
    {copied && <span role="status" className="sr-only">WhatsApp number copied</span>}
    {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
  </div>
}
