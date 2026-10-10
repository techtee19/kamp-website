'use client'

export default function AdminDashboardError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-5 py-12">
      <section className="w-full max-w-lg rounded-2xl border border-brand-card bg-white p-8 text-center shadow-sm">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">Admin dashboard</p>
        <h1 className="font-display text-2xl font-bold text-brand-black">Dashboard couldn’t load</h1>
        <p className="mt-3 text-sm leading-6 text-brand-grey">
          The dashboard data is temporarily unavailable. Try loading it again in a moment.
        </p>
        <button
          type="button"
          onClick={() => retry()}
          className="mt-6 rounded-full bg-brand-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-black/80"
        >
          Try again
        </button>
      </section>
    </main>
  )
}
