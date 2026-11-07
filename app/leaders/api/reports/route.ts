import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getLeader } from '@/lib/leader-auth'
import { leaderReportSchema } from '@/lib/leader-validations'
import { isSameOriginLeaderRequest } from '@/lib/leader-request'
import { getClientIp, rateLimit } from '@/lib/ratelimit'
import { getCEOEmail, sendNewSubmissionNotice } from '@/lib/email'
import { readJsonRequest } from '@/lib/request-body'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const leader = await getLeader()
  if (!leader) return NextResponse.json({ error: 'Sign in to continue.' }, { status: 401 })
  if (!isSameOriginLeaderRequest(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  if (!(await rateLimit(`leader-report:${leader.id}:${getClientIp(request)}`, 10, 60_000))) return NextResponse.json({ error: 'Please wait before submitting another report.' }, { status: 429 })
  let body: unknown
  try { body = await readJsonRequest(request, 16 * 1024) } catch { return NextResponse.json({ error: 'Invalid form data.' }, { status: 400 }) }
  const parsed = leaderReportSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Check the report fields.' }, { status: 400 })
  const d = parsed.data
  try {
    const [report] = await db`
      INSERT INTO leader_reports (leader_id, report_type, title, report_date, events_held, attendance, summary, achievements, challenges, next_steps, links)
      VALUES (${leader.id}, ${d.reportType}, ${d.title}, ${d.reportDate}, ${d.eventsHeld ?? null}, ${d.attendance ?? null}, ${d.summary}, ${d.achievements || null}, ${d.challenges || null}, ${d.nextSteps || null}, ${d.links || null})
      RETURNING id
    `
    try { await sendNewSubmissionNotice({ to: getCEOEmail(), submissionType: 'report', title: d.title, leaderName: String(leader.full_name), campus: String(leader.campus), details: [{ label: 'Report type', value: d.reportType }, { label: 'Date', value: d.reportDate }, { label: 'Summary', value: d.summary }], adminUrl: `${process.env.NEXTAUTH_URL || request.nextUrl.origin}/admin/reports/${report.id}` }) }
    catch (emailError) { console.error('[leaders/reports] Report saved, CEO notification email failed:', emailError) }
    return NextResponse.json({ success: true, id: report.id }, { status: 201 })
  } catch (error) {
    console.error('[leaders/reports] Submission failed:', error)
    return NextResponse.json({ error: 'Your report could not be submitted. Please try again.' }, { status: 503 })
  }
}
