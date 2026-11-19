import MembershipSupportForm from '@/components/membership/MembershipSupportForm'

export const metadata = { title: 'Membership support | KAMP' }

export default async function MembershipSupportPage({ searchParams }: { searchParams: Promise<{ issue?: string }> }) {
  const { issue } = await searchParams
  return <main className="container max-w-2xl px-5 pb-24 pt-32 text-brand-ink">
    <h1 className="font-display text-4xl font-semibold">Get help with your KAMP membership</h1>
    <p className="mt-4 text-brand-grey">Get help with your member ID, welcome email, registration, or joining the WhatsApp community.</p>
    <MembershipSupportForm initialIssue={issue === 'whatsapp' ? 'whatsapp' : 'membership'} />
  </main>
}
