export default async function EventDetailPage({ params }: PageProps<'/events/[slug]'>) {
  const { slug } = await params

  return (
    <div className="container py-24">
      <h1 className="font-display text-navy text-4xl">Event: {slug}</h1>
      <p className="text-muted mt-4">Placeholder — built in Phase 11.</p>
    </div>
  )
}
