import { z } from 'zod'
import { db } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-session'
import { isSameOriginAdminRequest } from '@/lib/admin-request'
import { NextRequest, NextResponse } from 'next/server'

const schema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('resolve'), id: z.uuid() }),
  z.object({ action: z.literal('correct_email'), id: z.uuid(), memberId: z.string().trim().min(5).max(64),
    email: z.email().max(254), ownershipVerified: z.literal(true) }),
])

export async function POST(request: NextRequest) {
  if (!(await getAdminSession()) || !isSameOriginAdminRequest(request)) return new Response(null, { status: 403 })
  const form = await request.formData()
  const parsed = schema.safeParse({
    ...Object.fromEntries(form),
    ownershipVerified: form.get('ownershipVerified') === 'on',
  })
  const destination = new URL('/admin/members/support', request.url)
  if (!parsed.success) {
    destination.searchParams.set('result', 'invalid')
    return NextResponse.redirect(destination, 303)
  }
  const input = parsed.data
  try {
    const updated = await db.begin(async (tx) => {
      const [support] = await tx`SELECT id FROM membership_support_requests WHERE id = ${input.id}::uuid AND resolved_at IS NULL FOR UPDATE`
      if (!support) return false
      if (input.action === 'correct_email') {
        const memberId = input.memberId.toUpperCase()
        const [member] = await tx`SELECT member_id, email FROM members WHERE member_id = ${memberId} AND status = 'active' FOR UPDATE`
        if (!member) return false
        const [busy] = await tx`SELECT 1 FROM registration_email_jobs
          WHERE member_id = ${memberId} AND (status = 'sending' OR (status = 'pending' AND uncertain_delivery)) LIMIT 1`
        if (busy) return false
        const email = input.email.toLowerCase()
        if (String(member.email).toLowerCase() === email) return false
        await tx`UPDATE members SET email = ${email} WHERE member_id = ${memberId}`
        await tx`UPDATE event_member_verifications SET consumed_at = NOW() WHERE member_id = ${memberId} AND consumed_at IS NULL`
        await tx`
          UPDATE registration_email_jobs SET status = 'pending', generation = generation + 1, attempts = 0,
            attachment = NULL, first_send_at = NULL, claimed_until = NULL, next_retry_at = NOW(),
            provider_message_id = NULL, provider_event_at = NULL, error_category = NULL, error_code = NULL,
            failed_at = NULL, uncertain_delivery = FALSE, updated_at = NOW()
          WHERE kind = 'welcome' AND member_id = ${memberId}
            AND (status IN ('bounced','suppressed') OR (status = 'failed' AND error_category = 'invalid_recipient' AND NOT uncertain_delivery))
        `
        await tx`INSERT INTO membership_correction_audit (support_id, member_id, action) VALUES (${input.id}::uuid, ${memberId}, 'verified_email_correction')`
      }
      await tx`UPDATE membership_support_requests SET resolved_at = NOW() WHERE id = ${input.id}::uuid`
      return true
    })
    destination.searchParams.set('result', updated ? 'saved' : 'unavailable')
  } catch {
    destination.searchParams.set('result', 'unavailable')
  }
  return NextResponse.redirect(destination, 303)
}
