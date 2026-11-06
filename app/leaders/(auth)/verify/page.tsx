import Link from 'next/link'
import VerifyLeaderLink from '@/components/leaders/VerifyLeaderLink'

export default async function LeaderVerifyPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams
  return <main className="grid min-h-screen place-items-center px-4 py-12"><section className="w-full max-w-md rounded-[2rem] border border-black/[.06] bg-white p-7 shadow-[0_24px_80px_rgba(35,32,23,.08)] sm:p-10"><Link href="/" className="text-xs font-semibold tracking-[.2em] text-brand-gold">KAMP</Link><p className="mt-9 text-[11px] font-semibold uppercase tracking-[.2em] text-black/40">Secure sign in</p><h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Open your workspace</h1><div className="mt-6"><VerifyLeaderLink token={token} /></div><p className="mt-6 text-center text-xs"><Link href="/leaders/login" className="text-black/50 underline underline-offset-4 hover:text-black">Request another sign-in link</Link></p></section></main>
}
