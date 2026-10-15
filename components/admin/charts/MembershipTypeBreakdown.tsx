import type { CategoryCount } from '@/lib/admin-analytics'

const barColors = ['bg-brand-ink', 'bg-brand-gold', 'bg-emerald-600']

export default function MembershipTypeBreakdown({ data }: { data: CategoryCount[] }) {
  const total = data.reduce((sum, category) => sum + category.count, 0)

  return (
    <div aria-label="Membership category distribution" className="space-y-5">
      {data.map((category, index) => (
        <div key={category.label}>
          <div className="mb-2 flex items-baseline justify-between gap-4">
            <span className="text-sm font-medium text-brand-ink">{category.label}</span>
            <span className="whitespace-nowrap text-sm tabular-nums text-brand-grey">
              <strong className="font-semibold text-brand-black">{category.count.toLocaleString()}</strong>
              <span className="ml-2 text-xs">{category.percentage}%</span>
            </span>
          </div>
          <div
            className="h-2.5 overflow-hidden rounded-full bg-brand-cream"
            role="progressbar"
            aria-label={`${category.label}: ${category.count} members`}
            aria-valuemin={0}
            aria-valuemax={total || 1}
            aria-valuenow={category.count}
          >
            <div
              className={`h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none ${barColors[index]}`}
              style={{ width: total ? `${(category.count / total) * 100}%` : '0%' }}
            />
          </div>
        </div>
      ))}
      <p className="border-t border-brand-card pt-4 text-xs text-brand-grey">
        {total.toLocaleString()} total registered {total === 1 ? 'member' : 'members'}
      </p>
    </div>
  )
}
