function Skeleton({ className }: { className: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-lg bg-brand-card ${className}`} />
}

export default function AdminDashboardLoading() {
  return (
    <div aria-busy="true" className="p-5 sm:p-8">
      <p className="mb-5 text-sm text-brand-grey">Loading dashboard data…</p>
      <Skeleton className="mb-8 h-8 w-40" />
      <div className="mb-10 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-32" />)}
      </div>
      <div className="mb-10 grid gap-5 xl:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-80" />)}
      </div>
      <Skeleton className="h-72 w-full" />
    </div>
  )
}
