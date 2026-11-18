import { timingSafeEqual } from 'node:crypto'
import { processRegistrationEmail } from '@/lib/registration-email'
import { db } from '@/lib/db'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  const expected = Buffer.from(`Bearer ${secret ?? ''}`)
  const provided = Buffer.from(request.headers.get('authorization') ?? '')
  if (!secret || expected.length !== provided.length || !timingSafeEqual(expected, provided)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  let processed = 0
  const deadline = Date.now() + 40_000
  while (processed < 20 && Date.now() < deadline && await processRegistrationEmail()) processed++
  await db`DELETE FROM event_member_verifications WHERE expires_at < NOW() - INTERVAL '1 day'`
  await db`DELETE FROM event_member_otp_audit WHERE created_at < NOW() - INTERVAL '180 days'`
  await db`DELETE FROM event_otp_provider_delivery WHERE provider_event_at < NOW() - INTERVAL '180 days'`
  await db`DELETE FROM membership_submission_receipts WHERE created_at < NOW() - INTERVAL '7 days'`
  return Response.json({ processed }, { headers: { 'Cache-Control': 'no-store' } })
}
