import { z } from 'zod'
import { db } from '@/lib/db'

export type SupportMember = {
  member_id: string
  full_name: string
  email: string
  status: string
  match_reason: string
  email_status: string | null
  error_category: string | null
  next_retry_at: string | null
}

type SupportRequest = {
  id: string
  reply_email: string
  member_id_hint: string | null
  message: string
  issue_type: 'membership' | 'whatsapp'
  whatsapp_number: string | null
  created_at: Date
  matches: SupportMember[]
}

export async function findMembershipSupportRequests(input: { requestId?: string; query?: string }) {
  const selected = z.uuid().safeParse(input.requestId)
  const requestId = selected.success ? selected.data : null
  const query = requestId ? (input.query ?? '').trim().slice(0, 160) : ''
  const pattern = '%' + query.replace(/[\\%_]/g, '\\$&') + '%'
  return db<SupportRequest[]>`
    SELECT request.id, request.reply_email, request.member_id_hint, request.message, request.created_at,
      request.issue_type, request.whatsapp_number,
      COALESCE((
        SELECT jsonb_agg(to_jsonb(candidate)) FROM (
          SELECT member.member_id, member.first_name || ' ' || member.last_name AS full_name,
            member.email, member.status,
            CASE WHEN LOWER(member.email) = LOWER(request.reply_email) THEN 'Registered email'
              WHEN UPPER(member.member_id) = UPPER(BTRIM(request.member_id_hint)) THEN 'Supplied member ID'
              ELSE 'Search result' END AS match_reason,
            job.status AS email_status, job.error_category, job.next_retry_at
          FROM members AS member
          LEFT JOIN registration_email_jobs AS job ON job.kind = 'welcome' AND job.reference = member.member_id
          WHERE LOWER(member.email) = LOWER(request.reply_email)
            OR UPPER(member.member_id) = UPPER(BTRIM(request.member_id_hint))
            OR (${query.length >= 2} AND (
              member.first_name || ' ' || member.last_name ILIKE ${pattern}
              OR member.email ILIKE ${pattern} OR member.member_id ILIKE ${pattern}
            ))
          ORDER BY (LOWER(member.email) = LOWER(request.reply_email)) DESC, member.joined_at DESC
          LIMIT 5
        ) AS candidate
      ), '[]'::jsonb) AS matches
    FROM membership_support_requests AS request
    WHERE request.resolved_at IS NULL AND (${requestId}::uuid IS NULL OR request.id = ${requestId}::uuid)
    ORDER BY request.created_at DESC LIMIT 100
  `
}
