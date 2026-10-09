'use client'

import type { GenderCount } from '@/lib/admin-analytics'

const colors: Record<string, string> = { Male: '#1A1A1A', Female: '#C9A227' }

export default function GenderBreakdown({ data }: { data: GenderCount[] }) {
  if (data.length === 0) return <p className="py-8 text-center text-sm text-brand-grey">No member data yet.</p>
  return (
    <div className="space-y-5">
      {data.map((item) => (
        <div key={item.gender}>
          <div className="mb-2 flex items-baseline justify-between gap-3 text-sm">
            <span className="font-medium text-brand-black">{item.label}</span>
            <span className="text-brand-grey">{item.count.toLocaleString()} · {item.percentage}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-brand-card" role="progressbar" aria-label={`${item.label} members`} aria-valuenow={item.percentage} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full rounded-full" style={{ width: `${item.percentage}%`, backgroundColor: colors[item.gender] ?? '#6B6B6B' }} />
          </div>
        </div>
      ))}
    </div>
  )
}
