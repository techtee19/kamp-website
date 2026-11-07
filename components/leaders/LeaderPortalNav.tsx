'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileText, LayoutDashboard, Wallet } from 'lucide-react'
import LeaderLogoutButton from '@/components/leaders/LeaderLogoutButton'

const links = [
  { href: '/leaders/dashboard', label: 'Overview', Icon: LayoutDashboard },
  { href: '/leaders/reports/new', label: 'Submit a report', Icon: FileText },
  { href: '/leaders/requests/new', label: 'Request support', Icon: Wallet },
]

export default function LeaderPortalNav({ name, campus }: { name: string; campus: string }) {
  const pathname = usePathname()
  return <header className="sticky top-0 z-20 border-b border-black/[.06] bg-brand-cream/90 backdrop-blur-xl">
    <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-3 sm:px-8 sm:py-4">
      <Link href="/leaders/dashboard" className="group flex min-w-0 items-center gap-3 rounded-2xl outline-none focus-visible:ring-4 focus-visible:ring-brand-gold/30"><span className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-2xl bg-brand-black text-sm font-bold tracking-[.14em] text-brand-gold shadow-[0_5px_14px_rgba(32,32,32,.12)]"><span>K</span><span className="absolute bottom-0 left-0 h-1 w-full bg-brand-gold" /></span><span className="min-w-0"><span className="block text-[11px] font-bold tracking-[.16em] text-brand-black">KAMP <span className="font-medium text-brand-ink/55">/ LEADERS</span></span><span className="mt-1 block max-w-[48vw] truncate text-xs text-black/50">{name}<span className="px-1.5 text-brand-gold">·</span>{campus}</span></span></Link>
      <nav aria-label="Leaders portal" className="order-3 flex w-full gap-1 overflow-x-auto sm:order-2 sm:w-auto sm:rounded-full sm:border sm:border-black/[.06] sm:bg-white/70 sm:p-1">{links.map(({ href, label, Icon }) => { const active = pathname === href || (href !== '/leaders/dashboard' && pathname.startsWith(href)); return <Link key={href} href={href} aria-current={active ? 'page' : undefined} className={`flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2.5 text-xs font-semibold transition-[background-color,color,transform] duration-150 active:scale-[.98] sm:px-4 sm:text-sm motion-reduce:transition-none ${active ? 'bg-brand-black text-white shadow-sm' : 'text-black/55 hover:bg-brand-cream hover:text-brand-black'}`}><Icon size={15} aria-hidden="true" className={active ? 'text-brand-gold' : ''} />{label}</Link> })}</nav>
      <div className="order-2 sm:order-3"><LeaderLogoutButton /></div>
    </div>
  </header>
}
