'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/admin/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const result = await response.json()
      if (!response.ok) {
        setError(result.error ?? 'Login failed.')
        setLoading(false)
        return
      }
      router.replace('/admin/dashboard')
      router.refresh()
    } catch {
      setError('Unable to reach the server. Try again.')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-black px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="mb-2 font-display text-4xl font-bold tracking-widest text-brand-gold">KAMP</p>
          <p className="text-sm text-white/60">Admin Access</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
          <label className="block text-sm text-white/80" htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            required
            maxLength={256}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter admin password"
            className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
          />
          {error && <p className="text-sm text-red-300" role="alert">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-full bg-brand-gold py-3 text-sm font-semibold text-brand-black transition hover:bg-brand-gold/90 disabled:cursor-wait disabled:opacity-50">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
