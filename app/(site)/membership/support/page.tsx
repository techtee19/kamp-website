import MembershipSupportForm from '@/components/membership/MembershipSupportForm'

export const metadata = { title: 'Membership support | KAMP' }

export default function MembershipSupportPage() {
  return <main className="container max-w-2xl px-5 pb-24 pt-32 text-brand-ink">
    <h1 className="font-display text-4xl font-semibold">Get help with your KAMP membership</h1>
    <p className="mt-4 text-brand-grey">Tell us if your welcome email or event code is missing, your member ID needs checking, or you can no longer access the email you registered with.</p>
    <MembershipSupportForm />
  </main>
}
