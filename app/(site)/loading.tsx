function Block({ className = '' }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-md bg-brand-ink/10 ${className}`} />
}

export default function Loading() {
  return (
    <main aria-label="Loading page content" aria-busy="true" className="min-h-[70vh]">
      <section className="bg-brand-cream py-20 sm:py-28">
        <div className="container max-w-[1120px]">
          <Block className="h-3 w-32" />
          <Block className="mt-6 h-12 w-full max-w-2xl sm:h-16" />
          <Block className="mt-3 h-12 w-4/5 max-w-xl sm:h-16" />
          <Block className="mt-6 h-4 w-full max-w-xl" />
          <Block className="mt-2 h-4 w-3/4 max-w-lg" />
          <Block className="mt-8 h-11 w-40 rounded-full" />
        </div>
      </section>
      <section className="container max-w-[1120px] py-14 sm:py-20">
        <Block className="h-8 w-72 max-w-full" />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="rounded-2xl border border-brand-ink/5 p-5">
              <Block className="h-36 w-full rounded-xl" />
              <Block className="mt-5 h-5 w-3/4" />
              <Block className="mt-3 h-3 w-full" />
              <Block className="mt-2 h-3 w-5/6" />
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
