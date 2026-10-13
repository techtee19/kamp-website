'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CalendarDays, LayoutDashboard, Users } from 'lucide-react'

const items = [
  { label: 'Dashboard', href: '/admin/dashboard', Icon: LayoutDashboard },
  { label: 'Members', href: '/admin/members', Icon: Users },
  { label: 'Events', href: '/admin/events', Icon: CalendarDays },
]

export default function AdminNavigation() {
  const pathname = usePathname()

  return (
    <nav aria-label="Admin navigation" className="flex min-w-0 flex-1 gap-1 overflow-x-auto p-2 lg:flex-col lg:p-4">
      {items.map(({ label, href, Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`)
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={`group flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors duration-150 active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100 lg:w-full ${active ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/[0.06] hover:text-white'}`}
          >
            <span className={`grid size-8 place-items-center rounded-lg transition-colors ${active ? 'bg-brand-gold text-brand-black' : 'bg-white/[0.06] text-white/60 group-hover:text-white'}`}>
              <Icon aria-hidden="true" size={16} strokeWidth={1.8} />
            </span>
            <span>{label}</span>
            {active && <span className="ml-auto hidden size-1.5 rounded-full bg-brand-gold lg:block" aria-hidden="true" />}
          </Link>
        )
      })}
    </nav>
  )
}
