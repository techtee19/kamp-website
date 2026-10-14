import { createHash, randomBytes } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-session'
import { isSameOriginAdminRequest } from '@/lib/admin-request'
import { readJsonRequest, requestBodyErrorResponse } from '@/lib/request-body'
import { isLeadershipRole, LEADERSHIP_ROLES } from '@/lib/leadership'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const invitationSchema = z.object({
  email: z.string().trim().max(254).pipe(z.email()),
  role: z.custom<keyof typeof LEADERSHIP_ROLES>(isLeadershipRole, 'Choose an approved leadership role.'),
})

class InvitationError extends Error {
  constructor(message: string, readonly status: number) { super(message) }
}

export async function POST(request: NextRequest) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!isSameOriginAdminRequest(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })

  let body: unknown
  try {
    body = await readJsonRequest(request, 1024)
  } catch (error) {
    const issue = requestBodyErrorResponse(error)
    return NextResponse.json({ error: issue?.message ?? 'Invalid request body.' }, { status: issue?.status ?? 400 })
  }

  const parsed = invitationSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Enter a valid email and leadership role.' }, { status: 400 })

  const email = parsed.data.email.toLowerCase()
  const role = parsed.data.role
  const roleInfo = LEADERSHIP_ROLES[role]
  const token = randomBytes(32).toString('base64url')
  const tokenHash = createHash('sha256').update(token).digest('hex')

  try {
    const invitation = await db.begin(async (tx) => {
      const [pending] = await tx`
        SELECT role_code
        FROM leadership_registration_invites
        WHERE LOWER(invitee_email) = ${email} AND consumed_at IS NULL
        FOR UPDATE
      `

      if (pending) {
        if (pending.role_code !== roleInfo.code) {
          throw new InvitationError('This email already has a pending invitation for a different leadership role. Revoke or use that invitation first.', 409)
        }
        const [updated] = await tx`
          UPDATE leadership_registration_invites
          SET token_hash = ${tokenHash}, expires_at = NOW() + INTERVAL '14 days'
          WHERE LOWER(invitee_email) = ${email} AND consumed_at IS NULL
          RETURNING expires_at
        `
        return updated
      }

      const [existingMember] = await tx`SELECT member_id FROM members WHERE LOWER(email) = ${email} LIMIT 1`
      if (existingMember) throw new InvitationError('A member already exists with this email address. Use the existing member record.', 409)

      await tx`SELECT pg_advisory_xact_lock(hashtext(${roleInfo.code}))`
      const [{ count }] = await tx<{ count: number }[]>`
        SELECT COUNT(*)::int AS count
        FROM leadership_registration_invites
        WHERE role_code = ${roleInfo.code}
          AND (consumed_at IS NOT NULL OR expires_at > NOW())
      `
      if (Number(count) >= roleInfo.maximum) throw new InvitationError(`All ${roleInfo.maximum} ${roleInfo.label.toLowerCase()} invitation slot${roleInfo.maximum === 1 ? '' : 's'} are already in use.`, 409)
      const [created] = await tx`
        INSERT INTO leadership_registration_invites (invitee_email, role_code, token_hash, expires_at)
        VALUES (${email}, ${roleInfo.code}, ${tokenHash}, NOW() + INTERVAL '14 days')
        RETURNING expires_at
      `
      return created
    })

    const invitationUrl = new URL('/membership/invite', request.nextUrl.origin)
    invitationUrl.hash = token
    return NextResponse.json({
      success: true,
      email,
      role: roleInfo.label,
      expiresAt: invitation.expires_at,
      invitationUrl: invitationUrl.toString(),
    }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    if (error instanceof InvitationError) return NextResponse.json({ error: error.message }, { status: error.status })
    console.error('Admin leadership invitation creation failed:', error)
    return NextResponse.json({ error: 'Could not create the leadership invitation. Confirm migration 012 is applied, then check the server logs.' }, { status: 500 })
  }
}
