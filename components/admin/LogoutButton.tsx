'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function logout() {
    setLoading(true)
    await fetch('/admin/api/logout', { method: 'POST' })
    router.replace('/admin/login')
    router.refresh()
  }

  return <button type="button" onClick={logout} disabled={loading} className="w-full rounded-lg px-4 py-2.5 text-left text-sm text-white/60 transition hover:bg-white/10 hover:text-white disabled:opacity-50">{loading ? 'Logging out…' : 'Log out'}</button>
}
