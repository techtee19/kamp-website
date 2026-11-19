import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-session'
import { isSameOriginAdminRequest } from '@/lib/admin-request'
import { queueSupportReply, supportReplySchema } from '@/lib/membership-support-reply'
import { SupportRecoveryError } from '@/lib/membership-support-recovery'
import { scheduleRegistrationEmail } from '@/lib/registration-background'
import { readJsonRequest, requestBodyErrorResponse } from '@/lib/request-body'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(request: NextRequest) {
  const headers = { 'Cache-Control': 'no-store' }
  if (!(await getAdminSession()) || !isSameOriginAdminRequest(request)) {
    return NextResponse.json({ error: 'Admin sign-in required.' }, { status: 403, headers })
  }
  let body
  try { body = await readJsonRequest(request, 3 * 1024 * 1024) }
  catch (error) {
    const failure = requestBodyErrorResponse(error)
    return NextResponse.json({ error: failure?.message ?? 'Check your subject and message, then try again.' }, { status: failure?.status ?? 400, headers })
  }
  const input = supportReplySchema.safeParse(body)
  if (!input.success) return NextResponse.json({ error: 'Check the subject, message (10–5,000 characters), and screenshots (up to three PNG/JPG images, 2 MB total).' }, { status: 400, headers })
  try {
    const { jobId } = await queueSupportReply(input.data)
    scheduleRegistrationEmail(jobId)
    return NextResponse.json({ queued: true }, { status: 202, headers })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof SupportRecoveryError ? error.message : 'Could not queue your reply. Try again with the same message.',
    }, { status: error instanceof SupportRecoveryError ? error.status : 503, headers })
  }
}
