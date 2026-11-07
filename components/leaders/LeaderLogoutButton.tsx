'use client'

import { useRouter } from 'next/navigation'

export default function LeaderLogoutButton() {
  const router = useRouter()
  return <button onClick={async () => { await fetch('/leaders/api/logout', { method: 'POST' }); router.replace('/leaders/login'); router.refresh() }} className="rounded-full border border-black/10 bg-white/60 px-4 py-2.5 text-xs font-semibold text-black/65 transition hover:border-black/25 hover:bg-white hover:text-black active:scale-[.98] sm:text-sm motion-reduce:transition-none">Sign out</button>
}
