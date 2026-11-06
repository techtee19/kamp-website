'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
export default function LeaderStatusButton({ id, status }: { id: number; status: string }) {
  const [busy, setBusy] = useState(false); const router = useRouter()
  return <button disabled={busy} onClick={async () => { setBusy(true); try { const response = await fetch(`/admin/api/leaders/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: status === 'active' ? 'inactive' : 'active' }) }); if (response.ok) router.refresh() } finally { setBusy(false) } }} className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium transition hover:bg-brand-cream disabled:opacity-50">{busy ? 'Saving…' : status === 'active' ? 'Deactivate' : 'Activate'}</button>
}
