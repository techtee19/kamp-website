import Link from 'next/link'
import { db } from '@/lib/db'
import CreateLeadershipInvite from '@/components/admin/CreateLeadershipInvite'
import { LEADERSHIP_ROLES } from '@/lib/leadership'

export const dynamic = 'force-dynamic'

export default async function LeadershipInvitationsPage() {
  const invitations = await db`
    SELECT id, invitee_email, role_code, consumed_member_id, expires_at, consumed_at, created_at
    FROM leadership_registration_invites
    ORDER BY created_at DESC
    LIMIT 50
  `

  return <div className="mx-auto max-w-[1400px] space-y-6 p-5 sm:p-8">
    <div><Link href="/admin/members" className="text-sm text-brand-grey transition hover:text-brand-black">← Back to members</Link><header className="mt-5"><p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-ink/65">KAMP / MEMBERS</p><h1 className="mt-2 font-display text-2xl font-bold text-brand-black sm:text-3xl">Leadership invitations</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-grey">Issue approved Founder, Co-Founder, and Board Member registration links. The role-specific member ID is assigned when the invited person completes registration.</p></header></div>
    <CreateLeadershipInvite />
    <section className="overflow-hidden rounded-2xl border border-brand-card bg-white">
      <div className="border-b border-brand-card px-5 py-4"><h2 className="font-semibold text-brand-black">Recent invitations</h2></div>
      <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-brand-card bg-brand-cream text-xs uppercase tracking-widest text-brand-grey">{['Member ID', 'Email', 'Leadership role', 'Status', 'Created'].map((heading) => <th key={heading} className="whitespace-nowrap px-4 py-3 font-semibold">{heading}</th>)}</tr></thead><tbody>
        {invitations.length === 0 ? <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-brand-grey">No leadership invitations have been issued.</td></tr> : invitations.map((invite) => {
          const role = Object.values(LEADERSHIP_ROLES).find((item) => item.code === invite.role_code)
          const expired = !invite.consumed_at && new Date(invite.expires_at as string).getTime() <= Date.now()
          const status = invite.consumed_at ? 'Registered' : expired ? 'Expired' : 'Awaiting registration'
          return <tr key={String(invite.id)} className="border-b border-brand-card last:border-0"><td className="whitespace-nowrap px-4 py-3 font-mono text-xs font-semibold text-brand-gold">{(invite.consumed_member_id as string | null) ?? 'Assigned at registration'}</td><td className="px-4 py-3 text-sm text-brand-black">{invite.invitee_email as string}</td><td className="whitespace-nowrap px-4 py-3 text-sm text-brand-grey">{role?.label ?? String(invite.role_code)}</td><td className="whitespace-nowrap px-4 py-3 text-sm text-brand-grey">{status}</td><td className="whitespace-nowrap px-4 py-3 text-sm text-brand-grey">{new Date(invite.created_at as string).toLocaleDateString('en-NG', { dateStyle: 'medium', timeZone: 'Africa/Lagos' })}</td></tr>
        })}
      </tbody></table></div>
    </section>
  </div>
}
