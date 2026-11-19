import { db } from '@/lib/db'
import { sendMembershipWelcome, sendRegistrationConfirmation, sendMembershipSupportReply, type MembershipSupportEmail } from '@/lib/email'
import { classifyEmailFailure, EmailProviderError, retryDelay } from '@/lib/email-failure'
import { generateMemberCardPDF } from '@/lib/member-card'
import { generateTicketPDF, type TicketData } from '@/lib/ticket'

export async function processRegistrationEmail(jobId?: string) {
  const job = await db.begin(async (tx) => {
    // Resend retains idempotency keys for 24 hours. Stop before that window ends
    // when delivery may already have been accepted but could not be recorded.
    await tx`
      UPDATE registration_email_jobs SET status = 'unknown', next_retry_at = NULL, attachment = NULL, updated_at = NOW()
      WHERE status IN ('pending','sending') AND (claimed_until IS NULL OR claimed_until < NOW())
        AND ((first_send_at < NOW() - INTERVAL '23 hours' AND (uncertain_delivery OR status = 'sending')) OR attempts >= 5)
        AND (${jobId ?? null}::uuid IS NULL OR id = ${jobId ?? null}::uuid)
    `
    const [claimed] = await tx`
      UPDATE registration_email_jobs AS job
      SET status = 'sending', attempts = attempts + 1, claimed_until = NOW() + INTERVAL '2 minutes',
        first_send_at = CASE WHEN uncertain_delivery OR job.status = 'sending' THEN COALESCE(first_send_at, NOW()) ELSE NOW() END,
        uncertain_delivery = uncertain_delivery OR job.status = 'sending', updated_at = NOW()
      FROM (
        SELECT id FROM registration_email_jobs
        WHERE status IN ('pending','sending') AND next_retry_at <= NOW()
          AND (claimed_until IS NULL OR claimed_until < NOW())
          AND (${jobId ?? null}::uuid IS NULL OR id = ${jobId ?? null}::uuid)
        ORDER BY next_retry_at FOR UPDATE SKIP LOCKED LIMIT 1
      ) AS ready WHERE job.id = ready.id RETURNING job.*
    `
    if (claimed) await tx`
      INSERT INTO registration_email_attempts (job_id, generation, attempt)
      VALUES (${claimed.id}, ${claimed.generation}, ${claimed.attempts})
    `
    return claimed
  })
  if (!job) return false

  const { id, attempts, generation } = job
  const options = { idempotencyKey: `registration/${id}/${generation}`, jobTag: `${id}-${generation}` }
  let messageId: string | null = null
  let sendAttempted = false
  let failure: ReturnType<typeof classifyEmailFailure> | undefined
  try {
    if (!process.env.EMAIL_FROM) throw new EmailProviderError('invalid_from_address', 400)
    if (job.kind === 'support_reply') {
      const images = await db`
        SELECT image.filename, image.content_type, image.content FROM membership_support_reply_images AS image
        JOIN membership_support_replies AS reply ON reply.id = image.reply_id
        WHERE reply.job_id = ${id} ORDER BY image.position
      `
      sendAttempted = true
      const sent = await sendMembershipSupportReply({ ...job.payload as MembershipSupportEmail, images: images.map((image) => ({
        filename: String(image.filename), contentType: image.content_type as 'image/png' | 'image/jpeg',
        content: Buffer.from(image.content).toString('base64'),
      })) }, options)
      messageId = sent.data?.id ?? null
    } else {
      let attachment = job.attachment as Buffer | null
      const [member] = await db`
        SELECT first_name, last_name, email, membership_type, kamp_position, university, occupation, organization,
          year_joined, passport_photo, passport_photo_type, status
        FROM members WHERE member_id = ${job.member_id} FOR SHARE
      `
      if (!member || member.status !== 'active') throw new EmailProviderError('inactive_member', 400)

      if (job.kind === 'welcome') {
        if (!attachment) {
          const photo = member.passport_photo
          attachment = await generateMemberCardPDF({
            firstName: String(member.first_name), lastName: String(member.last_name), memberId: String(job.member_id),
            membershipType: String(member.membership_type), kampPosition: String(member.kamp_position ?? 'General Member'),
            affiliation: member.membership_type === 'student' ? String(member.university ?? 'Student')
              : [member.occupation, member.organization].filter(Boolean).join(' · ') || 'KAMP Community',
            yearJoined: Number(member.year_joined),
            ...(Buffer.isBuffer(photo) && photo.length && ['image/jpeg', 'image/png'].includes(String(member.passport_photo_type))
              ? { passportDataUri: `data:${member.passport_photo_type};base64,${photo.toString('base64')}` } : {}),
          })
          if (!(await saveAttachment(id, generation, attempts, attachment))) return true
        }
        sendAttempted = true
        const sent = await sendMembershipWelcome({
          to: String(member.email), firstName: String(member.first_name), memberId: String(job.member_id), cardPDF: attachment,
          communityJoinUrl: (job.payload as { communityJoinUrl?: string }).communityJoinUrl,
        }, options)
        messageId = sent.data?.id ?? null
      } else {
        const ticket = job.payload as TicketData
        if (!attachment) {
          attachment = await generateTicketPDF(ticket)
          if (!(await saveAttachment(id, generation, attempts, attachment))) return true
        }
        sendAttempted = true
        const sent = await sendRegistrationConfirmation({
          to: String(member.email), recipientName: ticket.attendeeName, eventTitle: ticket.eventTitle,
          eventDate: ticket.eventDate, eventLocation: ticket.eventLocation, university: ticket.attendeeUniversity || 'KAMP member',
          ticketRef: ticket.ticketRef, ticketPDF: attachment,
        }, options)
        messageId = sent.data?.id ?? null
      }
    }
    if (!messageId) throw new Error('Provider returned no message ID')
  } catch (error) {
    failure = classifyEmailFailure(error)
    if (!sendAttempted && failure.code === 'transport_error') failure.code = 'message_preparation_error'
  }

  const delay = failure ? retryDelay(failure.category, Number(attempts), failure.retryAfter, failure.code, Date.now()) : null
  // A later permanent rejection does not prove a prior ambiguous attempt failed.
  const uncertain = ((sendAttempted && (failure?.category === 'temporary' || failure?.category === 'unknown'))
    || job.uncertain_delivery)
  const status = !failure ? 'accepted' : delay !== null ? 'pending' : uncertain ? 'unknown' : 'failed'
  await db.begin(async (tx) => {
    const [finished] = await tx`
      UPDATE registration_email_jobs
      SET status = ${status}, provider_message_id = COALESCE(${messageId}, provider_message_id),
        next_retry_at = ${delay === null ? null : new Date(Date.now() + delay)},
        claimed_until = NULL, uncertain_delivery = ${Boolean(failure && uncertain)},
        error_category = ${failure?.category ?? null}, error_code = ${failure?.code ?? null},
        failed_at = CASE WHEN ${Boolean(failure)} THEN NOW() ELSE NULL END, updated_at = NOW(),
        attachment = CASE WHEN ${status} = 'pending' THEN attachment ELSE NULL END
      WHERE id = ${id} AND generation = ${generation} AND attempts = ${attempts} AND status = 'sending'
      RETURNING id
    `
    await tx`
      UPDATE registration_email_attempts SET outcome = ${finished ? status : 'reconciled'},
        error_category = ${failure?.category ?? null}, error_code = ${failure?.code ?? null}
      WHERE job_id = ${id} AND generation = ${generation} AND attempt = ${attempts}
    `
    const tokenHash = (job.payload as { tokenHash?: string }).tokenHash
    if (messageId && tokenHash) await tx`
      UPDATE member_community_invite_links SET email_sent_at = COALESCE(email_sent_at, NOW()) WHERE token_hash = ${tokenHash}
    `
  })
  return true
}

async function saveAttachment(id: string, generation: number, attempt: number, attachment: Buffer) {
  const rows = await db`
    UPDATE registration_email_jobs SET attachment = ${attachment}
    WHERE id = ${id} AND generation = ${generation} AND attempts = ${attempt} AND status = 'sending'
    RETURNING id
  `
  return rows.length > 0
}

export async function tryRegistrationEmail(jobId: string) {
  try {
    await processRegistrationEmail(jobId)
    // Each new signup also gives an older due job a chance to recover,
    // including on hosting plans whose scheduled worker runs only daily.
    await processRegistrationEmail()
  }
  catch { console.error('[registration-email] Worker failed', { jobId }) }
}
