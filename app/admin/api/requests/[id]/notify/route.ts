import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-session'
import { isSameOriginAdminRequest } from '@/lib/admin-request'
import { sendNewSubmissionNotices } from '@/lib/email'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!isSameOriginAdminRequest(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })

  const { id } = await params
  if (!/^\d+$/.test(id) || !Number.isSafeInteger(Number(id))) {
    return NextResponse.json({ error: 'Request not found.' }, { status: 404 })
  }

  try {
    const [row] = await db`
      SELECT request.title, request.request_type, request.description, request.amount_requested,
        leader.full_name AS leader_name, leader.campus
      FROM leader_requests AS request
      JOIN leaders AS leader ON leader.id = request.leader_id
      WHERE request.id = ${Number(id)}
      LIMIT 1
    `
    if (!row) return NextResponse.json({ error: 'Request not found.' }, { status: 404 })

    const result = await sendNewSubmissionNotices({
      submissionType: 'request',
      title: String(row.title),
      leaderName: String(row.leader_name),
      campus: String(row.campus),
      details: [
        { label: 'Type', value: String(row.request_type) },
        { label: 'Description', value: String(row.description) },
        ...(row.amount_requested ? [{ label: 'Amount', value: `₦${Number(row.amount_requested).toLocaleString('en-NG')}` }] : []),
      ],
      adminUrl: `${process.env.NEXTAUTH_URL || request.nextUrl.origin}/admin/requests/${id}`,
    })

    return NextResponse.json({ success: true, sent: result.sent }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('[admin/requests] Could not send admin notification:', error)
    return NextResponse.json({ error: 'Could not send the admin notification. Check the email configuration and try again.' }, { status: 502 })
  }
}
