import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, Check, Search, UserRound } from 'lucide-react'
import { getAdminSession } from '@/lib/admin-session'
import { findMembershipSupportRequests } from '@/lib/membership-support-data'
import SupportWelcomeAction from '@/components/admin/SupportWelcomeAction'
import SupportWhatsAppNumber from '@/components/admin/SupportWhatsAppNumber'
import SupportReplyComposer from '@/components/admin/SupportReplyComposer'
import { getSiteOrigin } from '@/lib/community'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

const field = 'mt-2 min-h-11 w-full rounded-xl border border-brand-ink/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20'
const deliveryLabels: Record<string, string> = {
  pending: 'Queued', sending: 'Sending', accepted: 'Accepted by Resend', delivered: 'Delivered',
  delayed: 'Delivery delayed', bounced: 'Bounced', suppressed: 'Suppressed', failed: 'Failed', unknown: 'Awaiting confirmation',
}

function nextStep(status: string | null, category: string | null) {
  if (status === 'bounced' || status === 'suppressed' || category === 'invalid_recipient') return 'Confirm the registered address with the member. Correct it below if needed, then check delivery before sending again.'
  if (status === 'unknown') return 'Review the previous message in Resend to confirm its outcome before issuing another copy.'
  if (status === 'pending' || status === 'sending') return 'A welcome email is already queued. Check its status before sending again.'
  return 'Send a copy of the member ID and welcome email to the registered address.'
}

export default async function AdminMembershipSupport({ searchParams }: {
  searchParams: Promise<{ result?: string; request?: string; q?: string; status?: string }>
}) {
  if (!(await getAdminSession())) redirect('/admin/login')
  const params = await searchParams
  const resolved = params.status === 'resolved'
  const requests = await findMembershipSupportRequests({ requestId: params.request, query: params.q, resolved })
  const membershipUrl = `${getSiteOrigin('https://wearekamp.org')}/membership`
  return <section className="mx-auto max-w-5xl space-y-6 px-5 py-7 sm:p-8">
    <Link href="/admin/members" className="inline-flex items-center gap-2 text-sm text-brand-grey hover:text-brand-ink">
      <ArrowLeft aria-hidden="true" className="size-4" /> Back to members
    </Link>
    <header>
      <h1 className="font-display text-3xl font-semibold tracking-tight">Membership support</h1>
      <p className="mt-2 text-sm leading-6 text-brand-grey">Find a member, recover their ID, and reply to requests by email.</p>
    </header>
    {params.request && <Link href="/admin/members/support" className="inline-block text-sm font-semibold underline underline-offset-4">View all open requests</Link>}
    {!params.request && <nav aria-label="Support request status" className="flex gap-2">
      <Link href="/admin/members/support" aria-current={!resolved ? 'page' : undefined} className={`min-h-10 rounded-full border px-4 py-2 text-sm font-semibold ${!resolved ? 'border-brand-ink bg-brand-ink text-white' : 'border-brand-card bg-white'}`}>Open requests</Link>
      <Link href="/admin/members/support?status=resolved" aria-current={resolved ? 'page' : undefined} className={`min-h-10 rounded-full border px-4 py-2 text-sm font-semibold ${resolved ? 'border-brand-ink bg-brand-ink text-white' : 'border-brand-card bg-white'}`}>Resolved requests</Link>
    </nav>}
    {params.result && <p role="status" className="rounded-xl border border-brand-card bg-white p-4 text-sm">
      {params.result === 'saved' ? 'Request resolved.' : 'The update could not be completed. Check the member details and active email jobs.'}
    </p>}
    {!requests.length && <p className="rounded-2xl border border-brand-card bg-white p-6 text-sm text-brand-grey">No {resolved ? 'resolved' : 'open'} requests found.</p>}
    {requests.map((request) => <article key={request.id} className="overflow-hidden rounded-2xl border border-brand-card bg-white shadow-[0_1px_2px_rgba(32,32,32,.03)]">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-brand-card px-5 py-5 sm:px-6">
        <div className="min-w-0">
          {request.issue_type === 'whatsapp' && <p className="mb-1 text-xs font-semibold text-[#176B42]">WhatsApp community access</p>}
          <p className="break-all font-semibold text-brand-ink">{request.reply_email}</p>
          <p className="mt-1 text-xs text-brand-grey">
            {new Date(request.created_at).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Africa/Lagos' })}
            {request.member_id_hint ? ` · Supplied ID ${request.member_id_hint}` : ' · Member ID not provided'}
          </p>
        </div>
        {request.resolved_at ? <span className="inline-flex min-h-10 items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-800"><Check aria-hidden="true" className="size-3.5" /> Resolved</span> : <form action="/admin/api/members/support" method="post">
          <input type="hidden" name="id" value={request.id} />
          <button name="action" value="resolve" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-brand-ink/15 px-4 py-2 text-xs font-semibold transition-colors hover:bg-brand-cream">
            <Check aria-hidden="true" className="size-3.5" /> Mark resolved
          </button>
        </form>}
      </header>
      <div className="space-y-5 p-5 sm:p-6">
        <p className="whitespace-pre-wrap break-words text-sm leading-6">{request.message}</p>
        <SupportReplyComposer requestId={request.id} recipient={request.reply_email} replyTo={process.env.ADMIN_EMAIL?.trim() ?? ''} replies={request.replies} resolved={Boolean(request.resolved_at)} suggestedMessage={request.issue_type === 'whatsapp'
          ? 'Hello,\n\nThank you for reaching out to KAMP. We’ve received your request for help joining the WhatsApp community. Please confirm that the WhatsApp number you supplied is correct so our team can help you join.\n\nThank you for your patience.'
          : !request.matches.length
            ? `Hello,\n\nThank you for reaching out to KAMP. We couldn’t find a membership using the details in your request. If you have already applied, please reply with your full name and any other email address you may have used so we can check before you register again.\n\nIf you haven’t applied yet, you can become a member here:\n${membershipUrl}\n\nWe’re happy to help you get started.`
            : 'Hello,\n\nThank you for reaching out to KAMP. We’ve found a matching membership and are looking into your request. Please let us know if you still need help receiving your member ID.\n\nThank you for your patience.'} />
        {!request.resolved_at && request.issue_type === 'whatsapp' && request.whatsapp_number && <section className="space-y-4 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 sm:p-5" aria-label="Manual WhatsApp addition">
          <div>
            <h2 className="font-semibold">Add to the WhatsApp community</h2>
            <p className="mt-1 text-sm leading-6 text-brand-grey">Use this number to add the requester in WhatsApp. Mark this request as added once you’ve completed the addition.</p>
          </div>
          <SupportWhatsAppNumber number={request.whatsapp_number} />
          <form action="/admin/api/members/support" method="post">
            <input type="hidden" name="id" value={request.id} />
            <button name="action" value="resolve_whatsapp" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#176B42] px-5 py-2.5 text-sm font-semibold text-white">
              <Check aria-hidden="true" className="size-4" /> Mark added & resolve
            </button>
          </form>
        </section>}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold">{request.matches.length ? 'Matching memberships' : 'Find their membership'}</h2>
          {!request.matches.length && <p className="rounded-xl bg-brand-cream p-4 text-sm leading-6 text-brand-grey">
            No membership matches the supplied email or ID. Search using their full name, another email, or member ID. If they have never registered, ask them to complete the membership form.
          </p>}
          {request.matches.map((member) => <div key={member.member_id} className="space-y-4 rounded-xl border border-brand-card bg-brand-cream/40 p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="flex items-center gap-2 font-semibold"><UserRound aria-hidden="true" className="size-4 text-brand-grey" />{member.full_name}</p>
                <p className="mt-1 text-xs text-brand-grey">{member.match_reason} · {member.status}</p>
                <p className="mt-3 select-all break-all font-mono text-base font-semibold text-brand-ink">{member.member_id}</p>
                <p className="mt-1 break-all text-sm text-brand-grey">{member.email}</p>
              </div>
              <Link href={`/admin/members/${encodeURIComponent(member.member_id)}`} className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold underline decoration-brand-gold decoration-2 underline-offset-4">
                Member profile <ArrowUpRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
            <div className="rounded-xl bg-white px-4 py-3 text-sm">
              <p><span className="text-brand-grey">Welcome email</span> · <strong>{member.email_status ? deliveryLabels[member.email_status] ?? member.email_status : 'No tracked email'}</strong></p>
              <p className="mt-1 text-xs leading-5 text-brand-grey">{nextStep(member.email_status, member.error_category)}</p>
              {member.error_category && <p className="mt-1 text-xs text-red-700">Failure category · {member.error_category}</p>}
              {member.next_retry_at && <p className="mt-1 text-xs text-brand-grey">Next retry from {new Date(member.next_retry_at).toLocaleString('en-NG', { timeZone: 'Africa/Lagos' })}</p>}
              <a href={`/admin/members/support?request=${request.id}`} className="mt-2 inline-block text-xs font-semibold underline underline-offset-4">Refresh delivery status</a>
            </div>
            {!request.resolved_at && member.status === 'active'
              && !['bounced', 'suppressed', 'unknown', 'sending'].includes(member.email_status ?? '')
              && !['invalid_recipient', 'bounced', 'suppressed'].includes(member.error_category ?? '')
              && <SupportWelcomeAction
              requestId={request.id} memberId={member.member_id} registeredEmail={member.email}
              confirmOwnership={member.email.toLowerCase() !== request.reply_email.toLowerCase()}
            />}
            {!request.resolved_at && <details className="border-t border-brand-card pt-3 text-sm">
              <summary className="cursor-pointer font-semibold">Correct this member’s email</summary>
              <form method="post" action="/admin/api/members/support" className="mt-4 grid gap-4">
                <input type="hidden" name="id" value={request.id} />
                <input type="hidden" name="memberId" value={member.member_id} />
                <label className="font-medium">Verified new email<input name="email" required type="email" maxLength={254} className={field} /></label>
                <label className="flex items-start gap-2.5 text-xs leading-5 text-brand-grey"><input type="checkbox" name="ownershipVerified" required className="mt-1 size-4 shrink-0 accent-brand-ink" />
                  I verified ownership through an existing trusted contact or in person, and confirmed access to the new address.
                </label>
                <button name="action" value="correct_email" className="min-h-11 w-fit rounded-full bg-brand-ink px-5 py-2.5 font-semibold text-white">Save correction and resolve</button>
              </form>
            </details>}
          </div>)}
        </div>
        <form method="get" action="/admin/members/support" className="border-t border-brand-card pt-4">
          <input type="hidden" name="request" value={request.id} />
          <label htmlFor={`search-${request.id}`} className="text-xs font-semibold text-brand-grey">Search by name, email, or member ID</label>
          <div className="mt-2 flex gap-2">
            <input id={`search-${request.id}`} name="q" type="search" minLength={2} maxLength={160} required defaultValue={params.request === request.id ? params.q ?? '' : ''} placeholder="Find another membership…" className={`${field} mt-0 min-w-0 flex-1`} />
            <button className="inline-flex min-h-11 items-center gap-2 rounded-full border border-brand-ink/15 px-4 text-sm font-semibold hover:bg-brand-cream">
              <Search aria-hidden="true" className="size-4" /><span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </form>
      </div>
    </article>)}
  </section>
}
