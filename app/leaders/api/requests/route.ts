import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getLeader } from '@/lib/leader-auth'
import { leaderRequestSchema } from '@/lib/leader-validations'
import { isSameOriginLeaderRequest } from '@/lib/leader-request'
import { getClientIp, rateLimit } from '@/lib/ratelimit'
import { getCEOEmail, sendNewSubmissionNotice } from '@/lib/email'
import { readJsonRequest } from '@/lib/request-body'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const leader = await getLeader()
  if (!leader) return NextResponse.json({ error: 'Sign in to continue.' }, { status: 401 })
  if (!isSameOriginLeaderRequest(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  if (!(await rateLimit(`leader-request:${leader.id}:${getClientIp(request)}`, 10, 60_000))) return NextResponse.json({ error: 'Please wait before submitting another request.' }, { status: 429 })
  let body: unknown
  try { body = await readJsonRequest(request, 16 * 1024) } catch { return NextResponse.json({ error: 'Invalid form data.' }, { status: 400 }) }
  const parsed = leaderRequestSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Check the request fields.' }, { status: 400 })
  const d = parsed.data
  try {
    const [requestRow] = await db`
      INSERT INTO leader_requests (leader_id, request_type, title, description, event_name, event_date, amount_requested, budget_breakdown, needed_by, links)
      VALUES (${leader.id}, ${d.requestType}, ${d.title}, ${d.description}, ${d.eventName || null}, ${d.eventDate || null}, ${d.amountRequested ?? null}, ${d.budgetBreakdown || null}, ${d.neededBy || null}, ${d.links || null})
      RETURNING id
    `
    try { await sendNewSubmissionNotice({ to: getCEOEmail(), submissionType: 'request', title: d.title, leaderName: String(leader.full_name), campus: String(leader.campus), details: [{ label: 'Type', value: d.requestType }, { label: 'Description', value: d.description }, ...(d.amountRequested ? [{ label: 'Amount', value: `₦${d.amountRequested.toLocaleString('en-NG')}` }] : [])], adminUrl: `${process.env.NEXTAUTH_URL || request.nextUrl.origin}/admin/requests/${requestRow.id}` }) }
    catch (emailError) { console.error('[leaders/requests] Request saved, CEO notification email failed:', emailError) }
    return NextResponse.json({ success: true, id: requestRow.id }, { status: 201 })
  } catch (error) {
    console.error('[leaders/requests] Submission failed:', error)
    return NextResponse.json({ error: 'Your request could not be submitted. Please try again.' }, { status: 503 })
  }
}
