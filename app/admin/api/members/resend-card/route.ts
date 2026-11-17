import { after, NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-session'
import { isSameOriginAdminRequest } from '@/lib/admin-request'
import { readJsonRequest, requestBodyErrorResponse } from '@/lib/request-body'
import { tryRegistrationEmail } from '@/lib/registration-email'
import { isMemberId } from '@/lib/member-id'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(request: NextRequest) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!isSameOriginAdminRequest(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  try {
    const body = await readJsonRequest(request, 1024)
    const memberId = typeof body === 'object' && body && 'memberId' in body ? body.memberId : null
    if (typeof memberId !== 'string' || !isMemberId(memberId)) return NextResponse.json({ error: 'Invalid member ID.' }, { status: 400 })
    // Only known API rejections can start a new delivery generation. An accepted,
    // bounced, suppressed, or ambiguous send needs separate reconciliation.
    const [reset] = await db`
      UPDATE registration_email_jobs SET status = 'pending', generation = generation + 1, attempts = 0,
        attachment = NULL, first_send_at = NULL, claimed_until = NULL, next_retry_at = NOW(),
        error_category = NULL, error_code = NULL, failed_at = NULL, updated_at = NOW()
      WHERE kind = 'welcome' AND reference = ${memberId} AND status = 'failed'
        AND provider_message_id IS NULL AND NOT uncertain_delivery
        AND COALESCE(error_category, '') NOT IN ('bounced', 'suppressed', 'invalid_recipient')
        AND updated_at < NOW() - CASE
          WHEN error_category = 'quota' THEN INTERVAL '1 hour' ELSE INTERVAL '60 seconds' END
      RETURNING id
    `
    const [ready] = reset ? [reset] : await db`
      SELECT id FROM registration_email_jobs
      WHERE kind = 'welcome' AND reference = ${memberId} AND status = 'pending'
        AND next_retry_at <= NOW() AND (claimed_until IS NULL OR claimed_until < NOW())
    `
    if (!ready) return NextResponse.json({
      error: 'There is no eligible welcome email to retry now. Check the delivery record and scheduled retry time.',
    }, { status: 409 })
    after(() => tryRegistrationEmail(String(ready.id)))
    return NextResponse.json({ queued: true }, { status: 202, headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    const bodyError = requestBodyErrorResponse(error)
    return NextResponse.json({ error: bodyError?.message ?? 'Could not recover the welcome email.' }, { status: bodyError?.status ?? 503 })
  }
}
