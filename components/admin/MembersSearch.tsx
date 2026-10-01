'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function MembersSearch({ defaultValue }: { defaultValue: string }) {
  const [value, setValue] = useState(defaultValue)
  const router = useRouter()
  const pathname = usePathname()
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  function updateSearch(nextValue: string) {
    setValue(nextValue)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      const params = new URLSearchParams()
      if (nextValue.trim()) params.set('q', nextValue.trim())
      params.set('page', '1')
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }, 250)
  }

  return <label className="block">
    <span className="sr-only">Search members</span>
    <input type="search" value={value} onChange={(event) => updateSearch(event.target.value)} maxLength={100} placeholder="Search by name, email, institution, member ID, or state…" className="w-full rounded-lg border border-brand-card bg-white px-4 py-3 text-sm outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold" />
  </label>
}
