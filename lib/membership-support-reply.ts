import { z } from 'zod'
import { createHash } from 'node:crypto'
import { db } from '@/lib/db'
import { rateLimitStatus } from '@/lib/ratelimit'
import { SupportRecoveryError } from '@/lib/membership-support-recovery'
import { MAX_SUPPORT_IMAGES, MAX_SUPPORT_IMAGE_BYTES, supportImageFilename } from '@/lib/support-reply-images'

const imageSchema = z.object({
  filename: z.string().max(200),
  contentType: z.enum(['image/png', 'image/jpeg']),
  content: z.string().min(4).max(Math.ceil(MAX_SUPPORT_IMAGE_BYTES / 3) * 4).regex(/^[A-Za-z0-9+/]+={0,2}$/),
})

function hasJPEGDimensions(content: Buffer): boolean {
  const frames = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf])
  let offset = 2
  while (offset + 4 < content.length) {
    if (content[offset] !== 0xff) return false
    while (content[offset] === 0xff) offset++
    const marker = content[offset++]
    if (marker === 0xd9 || marker === 0xda) return false
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue
    if (offset + 2 > content.length) return false
    const length = content.readUInt16BE(offset)
    if (length < 2 || offset + length > content.length) return false
    if (frames.has(marker)) return length >= 7 && content.readUInt16BE(offset + 3) > 0 && content.readUInt16BE(offset + 5) > 0
    offset += length
  }
  return false
}

export const supportReplySchema = z.object({
  supportId: z.uuid(),
  replyId: z.uuid(),
  subject: z.string().trim().min(1).max(160).refine((value) => !/[\r\n]/.test(value)),
  message: z.string().trim().min(10).max(5000),
  images: z.array(imageSchema).max(MAX_SUPPORT_IMAGES).default([]),
})

export async function queueSupportReply(input: z.infer<typeof supportReplySchema>) {
  let totalBytes = 0
  const images = input.images.map((image) => {
    const content = Buffer.from(image.content, 'base64')
    totalBytes += content.length
    const isPNG = content.length >= 45 && content.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
      && content.toString('ascii', 12, 16) === 'IHDR'
      && content.readUInt32BE(16) > 0 && content.readUInt32BE(20) > 0
      && content.subarray(-8).equals(Buffer.from([73, 69, 78, 68, 174, 66, 96, 130]))
    const isJPEG = content.length >= 4 && content[0] === 0xff && content[1] === 0xd8 && content[2] === 0xff
      && content[content.length - 2] === 0xff && content[content.length - 1] === 0xd9 && hasJPEGDimensions(content)
    if (content.toString('base64') !== image.content || !(image.contentType === 'image/png' ? isPNG : isJPEG)) {
      throw new SupportRecoveryError('One of the screenshots is not a valid PNG or JPG image.', 400)
    }
    return { content, contentType: image.contentType, filename: supportImageFilename(image.filename, image.contentType), sha256: createHash('sha256').update(content).digest('hex') }
  })
  if (totalBytes > MAX_SUPPORT_IMAGE_BYTES) throw new SupportRecoveryError('Screenshots must total 2 MB or less.', 400)
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
      const previousImages = await tx`SELECT filename, content_type, sha256 FROM membership_support_reply_images WHERE reply_id = ${input.replyId}::uuid ORDER BY position`
      const sameImages = previousImages.length === images.length && previousImages.every((previous, index) =>
        previous.filename === images[index].filename && previous.content_type === images[index].contentType && previous.sha256 === images[index].sha256)
      if (existing.support_id !== input.supportId || existing.subject !== input.subject || existing.message !== input.message || !sameImages) {
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
    for (const [position, image] of images.entries()) await tx`
      INSERT INTO membership_support_reply_images (reply_id, position, filename, content_type, content, sha256)
      VALUES (${input.replyId}::uuid, ${position}, ${image.filename}, ${image.contentType}, ${image.content}, ${image.sha256})
    `
    return { jobId: String(job.id) }
  })
}
