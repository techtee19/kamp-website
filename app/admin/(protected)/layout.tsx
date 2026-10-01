import Link from 'next/link'
import { redirect } from 'next/navigation'
import LogoutButton from '@/components/admin/LogoutButton'
import { getAdminSession } from '@/lib/admin-session'

const adminNav = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Members', href: '/admin/members' },
  { label: 'Events', href: '/admin/events' },
]

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await getAdminSession())) redirect('/admin/login')

  return (
    <div className="min-h-screen bg-brand-cream lg:flex">
      <aside className="flex shrink-0 flex-col bg-brand-black text-white lg:fixed lg:inset-y-0 lg:left-0 lg:w-64">
        <div className="border-b border-white/10 p-6">
          <p className="font-display text-xl font-bold tracking-widest text-brand-gold">KAMP</p>
          <p className="mt-1 text-xs text-white/50">Admin Dashboard</p>
        </div>
        <nav aria-label="Admin navigation" className="flex flex-1 gap-1 overflow-x-auto p-3 lg:flex-col lg:p-4">
          {adminNav.map((item) => <Link key={item.href} href={item.href} className="shrink-0 rounded-lg px-4 py-2.5 text-sm text-white/70 transition hover:bg-white/10 hover:text-white">{item.label}</Link>)}
        </nav>
        <div className="hidden border-t border-white/10 p-4 lg:block"><LogoutButton /></div>
        <div className="border-t border-white/10 p-3 lg:hidden"><LogoutButton /></div>
      </aside>
      <main className="min-w-0 flex-1 lg:ml-64">{children}</main>
    </div>
  )
}
