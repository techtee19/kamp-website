import { redirect } from 'next/navigation'
import AdminNavigation from '@/components/admin/AdminNavigation'
import LogoutButton from '@/components/admin/LogoutButton'
import { getAdminSession } from '@/lib/admin-session'

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await getAdminSession())) redirect('/admin/login')

  return (
    <div className="min-h-screen bg-brand-cream lg:flex">
      <aside className="relative z-10 flex shrink-0 flex-col border-b border-white/10 bg-brand-black text-white lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:border-b-0 lg:border-r lg:border-white/[0.06]">
        <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:block lg:border-b lg:border-white/10 lg:px-6 lg:py-6">
          <div>
            <p className="font-display text-lg font-bold tracking-[0.16em] text-brand-gold lg:text-xl">KAMP</p>
            <p className="mt-0.5 text-[11px] tracking-wide text-white/45">ADMINISTRATION</p>
          </div>
          <div className="lg:hidden"><LogoutButton /></div>
        </div>
        <AdminNavigation />
        <div className="hidden border-t border-white/10 p-4 lg:block"><LogoutButton /></div>
      </aside>
      <main className="min-w-0 flex-1 lg:ml-64">{children}</main>
    </div>
  )
}
