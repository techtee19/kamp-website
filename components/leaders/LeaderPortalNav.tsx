import Link from 'next/link'
import { FileText, LayoutDashboard, Wallet } from 'lucide-react'
import LeaderLogoutButton from '@/components/leaders/LeaderLogoutButton'

const links = [
  { href: '/leaders/dashboard', label: 'Overview', Icon: LayoutDashboard },
  { href: '/leaders/reports/new', label: 'Submit a report', Icon: FileText },
  { href: '/leaders/requests/new', label: 'Request support', Icon: Wallet },
]

export default function LeaderPortalNav({ name, campus }: { name: string; campus: string }) {
  return <header className="sticky top-0 z-20 border-b border-black/[.06] bg-brand-cream/90 backdrop-blur-xl">
    <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-8">
      <Link href="/leaders/dashboard" className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-brand-black text-xs font-bold tracking-widest text-brand-gold">K</span><span><span className="block text-sm font-semibold tracking-wide">KAMP / LEADERS</span><span className="mt-0.5 block text-xs text-black/50">{name} · {campus}</span></span></Link>
      <nav aria-label="Leaders portal" className="order-3 flex w-full gap-1 overflow-x-auto sm:order-2 sm:w-auto">{links.map(({ href, label, Icon }) => <Link key={href} href={href} className="flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs font-medium text-black/60 transition hover:bg-white hover:text-black sm:text-sm"><Icon size={15} aria-hidden="true" />{label}</Link>)}</nav>
      <div className="order-2 sm:order-3"><LeaderLogoutButton /></div>
    </div>
  </header>
}
