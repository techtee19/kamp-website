import { z } from 'zod'
import { db } from '@/lib/db'
import { rateLimitStatus } from '@/lib/ratelimit'
import { SupportRecoveryError } from '@/lib/membership-support-recovery'

export const supportReplySchema = z.object({
  supportId: z.uuid(),
  replyId: z.uuid(),
  subject: z.string().trim().min(1).max(160).refine((value) => !/[\r\n]/.test(value)),
  message: z.string().trim().min(10).max(5000),
})

export async function queueSupportReply(input: z.infer<typeof supportReplySchema>) {
  return db.begin(async (tx) => {
    const [support] = await tx`
      SELECT reply_email, resolved_at FROM membership_support_requests
      WHERE id = ${input.supportId}::uuid FOR UPDATE
    `
    if (!support) throw new SupportRecoveryError('This support request could not be found.', 404)
    const [existing] = await tx`
      SELECT support_id, subject, message, job_id FROM membership_support_replies WHERE id = ${input.replyId}::uuid
    `
    if (existing) {
      if (existing.support_id !== input.supportId || existing.subject !== input.subject || existing.message !== input.message) {
        throw new SupportRecoveryError('This reply was already submitted with different content. Refresh the request before writing another reply.')
      }
      return { jobId: String(existing.job_id) }
    }
    if (support.resolved_at) throw new SupportRecoveryError('This request is already resolved.')
    const replyTo = z.email().safeParse(process.env.ADMIN_EMAIL?.trim())
    if (!replyTo.success || !process.env.EMAIL_FROM?.trim()) {
      throw new SupportRecoveryError('Configure ADMIN_EMAIL and EMAIL_FROM before sending support replies.', 503)
    }
    const [busy] = await tx`
      SELECT 1 FROM membership_support_replies AS reply
      JOIN registration_email_jobs AS job ON job.id = reply.job_id
      WHERE reply.support_id = ${input.supportId}::uuid
        AND job.status IN ('pending', 'sending', 'unknown')
      LIMIT 1
    `
    if (busy) throw new SupportRecoveryError('An earlier reply is queued or awaiting confirmation. Refresh its delivery status before sending another.')
    const limit = await rateLimitStatus(`support-reply:${input.supportId}`, 3, 60 * 60_000, tx)
    if (!limit.allowed) throw new SupportRecoveryError('Three replies have already been requested for this support request this hour. Please try again later.', 429)
    const [job] = await tx`
      INSERT INTO registration_email_jobs (kind, reference, payload)
      VALUES ('support_reply', ${input.replyId}, ${tx.json({
        to: String(support.reply_email), replyTo: replyTo.data, subject: input.subject, message: input.message,
      })}) RETURNING id
    `
    await tx`
      INSERT INTO membership_support_replies (id, support_id, job_id, recipient, subject, message)
      VALUES (${input.replyId}::uuid, ${input.supportId}::uuid, ${job.id}, ${support.reply_email}, ${input.subject}, ${input.message})
    `
    return { jobId: String(job.id) }
  })
}
