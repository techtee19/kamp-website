import type { Metadata } from 'next'
import Link from 'next/link'
import WhatsAppJoinAction from '@/components/membership/WhatsAppJoinAction'

export const metadata: Metadata = {
  title: 'Join the KAMP Community | KAMP',
  robots: { index: false, follow: false },
}

export default function CommunityJoinPage() {
  return <main className="grid min-h-screen place-items-center bg-brand-cream px-4 py-12 text-brand-ink">
    <section className="w-full max-w-xl rounded-3xl border border-white bg-white p-7 shadow-[0_24px_70px_rgba(23,35,59,0.1)] sm:p-10">
      <Link href="/" className="text-sm font-semibold text-brand-grey transition hover:text-brand-ink">← KAMP home</Link>
      <p className="mt-9 text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">Stay connected</p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Join the KAMP WhatsApp community</h1>
      <p className="mt-4 leading-relaxed text-brand-grey">Connect with fellow members and keep up with KAMP stories, opportunities, and community updates.</p>
      <div className="mt-7"><WhatsAppJoinAction /></div>
      <p className="mt-5 text-xs leading-relaxed text-brand-grey">This link records that you chose to continue to WhatsApp. It does not confirm that you joined the group.</p>
    </section>
  </main>
}
