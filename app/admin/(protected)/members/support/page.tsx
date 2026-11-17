import Link from 'next/link'
import { db } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-session'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AdminMembershipSupport({ searchParams }: { searchParams: Promise<{ result?: string }> }) {
  if (!(await getAdminSession())) redirect('/admin/login')
  const [{ result }, requests] = await Promise.all([searchParams, db`
    SELECT id, reply_email, member_id_hint, message, created_at
    FROM membership_support_requests WHERE resolved_at IS NULL ORDER BY created_at DESC LIMIT 100
  `])
  return <section className="mx-auto max-w-4xl space-y-5 p-6">
    <Link href="/admin/members" className="text-sm underline">Back to members</Link>
    <h1 className="font-display text-3xl font-semibold">Membership support</h1>
    {result && <p role="status">{result === 'saved' ? 'Request resolved.' : 'The update could not be completed. Check the details and any active email jobs.'}</p>}
    {!requests.length && <p>No open requests.</p>}
    {requests.map((request) => <article key={String(request.id)} className="space-y-4 rounded-xl bg-white p-5">
      <div>
        <p className="font-semibold">{String(request.reply_email)}</p>
        <p className="text-sm text-brand-grey">{request.member_id_hint ? String(request.member_id_hint) : 'No member ID supplied'}</p>
      </div>
      <p className="whitespace-pre-wrap break-words text-sm">{String(request.message)}</p>
      <form action="/admin/api/members/support" method="post">
        <input type="hidden" name="id" value={String(request.id)} />
        <button name="action" value="resolve" className="text-sm font-semibold underline">Mark resolved</button>
      </form>
      <details className="text-sm">
        <summary className="cursor-pointer font-semibold">Correct the registered email</summary>
        <form method="post" action="/admin/api/members/support" className="mt-3 grid gap-3">
          <input type="hidden" name="id" value={String(request.id)} />
          <label>Verified member ID<input name="memberId" required maxLength={64} className="ml-2 rounded border p-2" /></label>
          <label>Verified new email<input name="email" required type="email" maxLength={254} className="ml-2 rounded border p-2" /></label>
          <label className="flex gap-2"><input type="checkbox" name="ownershipVerified" required />
            I confirmed the requester’s ownership through an existing trusted contact or in person, and confirmed access to the new address.
          </label>
          <button name="action" value="correct_email" className="w-fit rounded bg-brand-ink px-4 py-2 font-semibold text-white">Save correction and resolve</button>
        </form>
      </details>
    </article>)}
  </section>
}
