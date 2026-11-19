import { db } from '@/lib/db'
import { rateLimitStatus } from '@/lib/ratelimit'
import { normalizeMemberId } from '@/lib/member-id'
import {
  createCommunityLinkToken,
  createTrackedCommunityUrl,
  getSiteOrigin,
  hashCommunityLinkToken,
} from '@/lib/community'

export class SupportRecoveryError extends Error {
  constructor(message: string, readonly status = 409) { super(message) }
}

/** Queue an administrator-requested copy to the existing registered address. */
export async function queueSupportWelcome(input: {
  supportId: string
  memberId: string
  ownershipVerified: boolean
  origin: string
}) {
  return db.begin(async (tx) => {
    const [support] = await tx`
      SELECT reply_email FROM membership_support_requests
      WHERE id = ${input.supportId}::uuid AND resolved_at IS NULL FOR UPDATE
    `
    if (!support) throw new SupportRecoveryError('This support request is already resolved or unavailable.', 404)

    const memberId = normalizeMemberId(input.memberId)
    const [member] = await tx`
      SELECT member_id, email, status FROM members WHERE member_id = ${memberId} FOR UPDATE
    `
    if (!member) throw new SupportRecoveryError('The selected membership could not be found.', 404)
    if (member.status !== 'active') throw new SupportRecoveryError('This membership is inactive. Review the member profile first.')
    if (String(member.email).toLowerCase() !== String(support.reply_email).toLowerCase() && !input.ownershipVerified) {
      throw new SupportRecoveryError('Confirm that this member record belongs to the requester before sending.', 400)
    }

    const [job] = await tx`
      SELECT id, status, attempts, error_category, uncertain_delivery, next_retry_at,
        updated_at > NOW() - INTERVAL '60 seconds' AS recently_updated
      FROM registration_email_jobs WHERE kind = 'welcome' AND reference = ${memberId}
      FOR UPDATE
    `
    if (job?.status === 'sending') throw new SupportRecoveryError('The welcome email is being processed. Refresh its delivery status shortly.')
    if (job && (['bounced', 'suppressed'].includes(String(job.status))
      || ['invalid_recipient', 'bounced', 'suppressed'].includes(String(job.error_category)))) {
      throw new SupportRecoveryError('Delivery to this address was bounced or suppressed. Confirm and correct the address before trying again.')
    }
    if (job && (job.status === 'unknown' || job.uncertain_delivery)) {
      throw new SupportRecoveryError('The previous send is awaiting confirmation. Review its Resend message before issuing another copy.')
    }
    if (job?.status === 'pending' && job.next_retry_at && new Date(job.next_retry_at as string).getTime() > Date.now()) {
      throw new SupportRecoveryError('A retry is already scheduled. Check the next retry time below.')
    }
    if (job && job.status !== 'pending' && job.recently_updated) {
      throw new SupportRecoveryError('Please wait at least a minute after the last email update before sending another copy.', 429)
    }
    const limit = await rateLimitStatus(`support-welcome:${memberId}`, 3, 60 * 60_000, tx)
    if (!limit.allowed) throw new SupportRecoveryError('Three recovery emails have already been requested for this member this hour. Please try again later.', 429)

    let jobId: string
    let generation: number
    if (job) {
      const resumePending = job.status === 'pending' && Number(job.attempts) < 5
      const [queued] = await tx`
        UPDATE registration_email_jobs
        SET status = 'pending',
          generation = CASE WHEN ${resumePending} THEN generation ELSE generation + 1 END,
          attempts = CASE WHEN ${resumePending} THEN attempts ELSE 0 END,
          attachment = CASE WHEN ${resumePending} THEN attachment ELSE NULL END,
          first_send_at = CASE WHEN ${resumePending} THEN first_send_at ELSE NULL END,
          claimed_until = NULL, next_retry_at = NOW(), provider_message_id = NULL, provider_event_at = NULL,
          error_category = NULL, error_code = NULL, failed_at = NULL, updated_at = NOW()
        WHERE id = ${job.id} RETURNING id, generation
      `
      jobId = String(queued.id)
      generation = Number(queued.generation)
    } else {
      const token = createCommunityLinkToken()
      const tokenHash = hashCommunityLinkToken(token)
      await tx`
        INSERT INTO member_community_tracking (member_id) VALUES (${memberId})
        ON CONFLICT (member_id) DO NOTHING
      `
      await tx`
        INSERT INTO member_community_invite_links (member_id, token_hash) VALUES (${memberId}, ${tokenHash})
      `
      const [queued] = await tx`
        INSERT INTO registration_email_jobs (kind, member_id, reference, payload)
        VALUES ('welcome', ${memberId}, ${memberId}, ${tx.json({
          communityJoinUrl: createTrackedCommunityUrl(token, getSiteOrigin(input.origin)), tokenHash,
        })})
        RETURNING id, generation
      `
      jobId = String(queued.id)
      generation = Number(queued.generation)
    }
    await tx`
      INSERT INTO registration_email_attempts (job_id, generation, attempt, outcome, support_request_id)
      VALUES (${jobId}::uuid, ${generation}, 0, 'support_recovery_requested', ${input.supportId}::uuid)
      ON CONFLICT (job_id, generation, attempt) DO NOTHING
    `
    return { jobId }
  })
}
