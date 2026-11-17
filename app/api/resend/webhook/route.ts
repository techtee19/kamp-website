import { z } from 'zod'
import { db } from '@/lib/db'
import { resend } from '@/lib/email'
import { deliveryStatus } from '@/lib/email-failure'
import { readRequestBytes } from '@/lib/request-body'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET
  if (!webhookSecret) return new Response(null, { status: 503 })
  let event
  try {
    event = resend().webhooks.verify({
      payload: new TextDecoder().decode(await readRequestBytes(request, 128 * 1024)),
      webhookSecret,
      headers: {
        id: request.headers.get('svix-id') ?? '',
        timestamp: request.headers.get('svix-timestamp') ?? '',
        signature: request.headers.get('svix-signature') ?? '',
      },
    })
  } catch {
    return new Response(null, { status: 400 })
  }
  const state = deliveryStatus(event.type)
  if (!state || !('email_id' in event.data)) return new Response(null, { status: 204 })
  const timestamp = new Date(event.created_at)
  if (!Number.isFinite(timestamp.getTime())) return new Response(null, { status: 400 })
  const messageId = event.data.email_id
  const tags = 'tags' in event.data ? event.data.tags as Record<string, string> | undefined : undefined
  const tag = /^(.+)-(\d{1,6})$/.exec(tags?.registration_job ?? '')
  const jobId = z.uuid().safeParse(tag?.[1])
  const terminal = ['delivered', 'bounced', 'suppressed', 'failed'].includes(state)
  const deliveryFailed = terminal && state !== 'delivered'
  await db.begin(async (tx) => {
    await tx`
      UPDATE registration_email_jobs
      SET status = ${state}, provider_message_id = ${messageId}, provider_event_at = ${timestamp},
        next_retry_at = NULL, claimed_until = NULL, attachment = NULL, updated_at = NOW(),
        error_category = ${deliveryFailed ? state : null},
        error_code = ${deliveryFailed ? event.type : null},
        failed_at = ${deliveryFailed ? timestamp : null}
      WHERE (provider_message_id = ${messageId}
        OR (id = ${jobId.success ? jobId.data : null}::uuid AND generation = ${tag ? Number(tag[2]) : null}
          AND (provider_message_id IS NULL OR provider_message_id = ${messageId})))
        AND (provider_event_at IS NULL OR provider_event_at < ${timestamp})
        AND (status NOT IN ('delivered','bounced','suppressed','failed') OR ${terminal})
    `
    if (tags?.kamp_event_otp === 'true') await tx`
      INSERT INTO event_otp_provider_delivery (provider_message_id, status, provider_event_at)
      VALUES (${messageId}, ${state}, ${timestamp})
      ON CONFLICT (provider_message_id) DO UPDATE SET
        status = EXCLUDED.status, provider_event_at = EXCLUDED.provider_event_at
      WHERE event_otp_provider_delivery.provider_event_at < EXCLUDED.provider_event_at
        AND (event_otp_provider_delivery.status NOT IN ('delivered','bounced','suppressed','failed') OR ${terminal})
    `
  })
  return new Response(null, { status: 204 })
}
