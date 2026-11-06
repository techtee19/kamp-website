import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getLeader } from '@/lib/leader-auth'
import PortalLoginForm from '@/components/leaders/PortalLoginForm'

export default async function LeaderLoginPage() {
  if (await getLeader()) redirect('/leaders/dashboard')
  return <main className="grid min-h-screen place-items-center px-4 py-12"><section className="w-full max-w-md rounded-[2rem] border border-black/[.06] bg-white p-7 shadow-[0_24px_80px_rgba(35,32,23,.08)] sm:p-10"><Link href="/" className="text-xs font-semibold tracking-[.2em] text-brand-gold">KAMP</Link><p className="mt-9 text-[11px] font-semibold uppercase tracking-[.2em] text-black/40">Private workspace</p><h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Leaders Portal</h1><p className="mt-3 mb-7 text-sm leading-6 text-black/55">Sign in with the email address your administrator added. We’ll send you a secure, one-time link.</p><PortalLoginForm /><p className="mt-6 text-center text-xs leading-5 text-black/40">Need access? Ask your KAMP administrator to invite you.</p></section></main>
}
