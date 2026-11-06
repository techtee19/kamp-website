'use client'

import { useRouter } from 'next/navigation'

export default function LeaderLogoutButton() {
  const router = useRouter()
  return <button onClick={async () => { await fetch('/leaders/api/logout', { method: 'POST' }); router.replace('/leaders/login'); router.refresh() }} className="rounded-full border border-black/10 px-4 py-2 text-sm text-black/70 transition hover:border-black/25 hover:text-black">Sign out</button>
}
