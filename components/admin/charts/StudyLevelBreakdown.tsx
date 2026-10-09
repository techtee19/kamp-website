'use client'

import type { CategoryCount } from '@/lib/admin-analytics'

const colors = ['#C9A227', '#1A1A1A', '#C9A227', '#1A1A1A', '#C9A227', '#6B6B6B', '#4ECDC4']

export default function StudyLevelBreakdown({ data }: { data: CategoryCount[] }) {
  if (data.length === 0) return <p className="py-8 text-center text-sm text-brand-grey">No member data yet.</p>
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {data.map((item, index) => (
        <div key={item.label} className="rounded-xl bg-brand-cream p-4">
          <p className="text-xs text-brand-grey">{item.label}</p>
          <div className="mt-1 flex items-end justify-between gap-2">
            <p className="font-display text-xl font-bold" style={{ color: colors[index % colors.length] }}>{item.count.toLocaleString()}</p>
            <p className="text-sm font-semibold text-brand-grey">{item.percentage}%</p>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white">
            <div className="h-full rounded-full" style={{ width: `${item.percentage}%`, backgroundColor: colors[index % colors.length] }} />
          </div>
        </div>
      ))}
    </div>
  )
}
