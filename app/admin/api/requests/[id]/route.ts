import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-session'
import { isSameOriginAdminRequest } from '@/lib/admin-request'
import { requestReviewSchema } from '@/lib/leader-validations'
import { sendRequestStatusUpdate } from '@/lib/email'
import { readJsonRequest } from '@/lib/request-body'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!isSameOriginAdminRequest(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  const { id } = await params
  if (!/^\d+$/.test(id)) return NextResponse.json({ error: 'Request not found.' }, { status: 404 })
  let body: unknown
  try { body = await readJsonRequest(request, 8 * 1024) } catch { return NextResponse.json({ error: 'Invalid review details.' }, { status: 400 }) }
  const parsed = requestReviewSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Check the review details.' }, { status: 400 })
  try {
    const [row] = await db`
      UPDATE leader_requests SET status = ${parsed.data.status}, review_note = ${parsed.data.reviewNote || null}, reviewed_at = NOW(), updated_at = NOW()
      WHERE id = ${Number(id)}
      RETURNING title, status, review_note, leader_id
    `
    if (!row) return NextResponse.json({ error: 'Request not found.' }, { status: 404 })
    const [leader] = await db`SELECT full_name, email FROM leaders WHERE id = ${row.leader_id} LIMIT 1`
    if (leader) {
      try { await sendRequestStatusUpdate({ to: String(leader.email), leaderName: String(leader.full_name), title: String(row.title), status: String(row.status), reviewNote: row.review_note ? String(row.review_note) : null, portalUrl: `${process.env.NEXTAUTH_URL || request.nextUrl.origin}/leaders/dashboard` }) }
      catch (error) { console.error('[admin/requests] Status updated, notification email failed:', error) }
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[admin/requests] Review update failed:', error)
    return NextResponse.json({ error: 'Could not save this review.' }, { status: 503 })
  }
}
