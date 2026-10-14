import { createHash } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { rateLimit, getClientIp } from '@/lib/ratelimit'
import { readJsonRequest, requestBodyErrorResponse } from '@/lib/request-body'
import { isLeadershipInviteToken, LEADERSHIP_ROLES } from '@/lib/leadership'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const tokenSchema = z.object({ token: z.custom<string>(isLeadershipInviteToken, 'This invitation link is invalid.') })

export async function POST(request: NextRequest) {
  try {
    if (!(await rateLimit(`leadership-invite-check:${getClientIp(request)}`, 10, 60_000))) {
      return NextResponse.json({ error: 'Too many attempts. Please wait a minute and try again.' }, { status: 429 })
    }
    let body: unknown
    try {
      body = await readJsonRequest(request, 1024)
    } catch (error) {
      const issue = requestBodyErrorResponse(error)
      return NextResponse.json({ error: issue?.message ?? 'Invalid request body.' }, { status: issue?.status ?? 400 })
    }
    const parsed = tokenSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'This invitation link is invalid, expired, or has already been used.' }, { status: 400 })

    const tokenHash = createHash('sha256').update(parsed.data.token).digest('hex')
    const [invite] = await db`
      SELECT invitee_email, role_code
      FROM leadership_registration_invites
      WHERE token_hash = ${tokenHash} AND consumed_at IS NULL AND expires_at > NOW()
      LIMIT 1
    `
    if (!invite) return NextResponse.json({ error: 'This invitation link is invalid, expired, or has already been used.' }, { status: 404 })

    const role = Object.values(LEADERSHIP_ROLES).find((item) => item.code === invite.role_code)
    if (!role) return NextResponse.json({ error: 'This invitation link is invalid, expired, or has already been used.' }, { status: 404 })
    return NextResponse.json({
      email: invite.invitee_email,
      role: role.label,
    }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Leadership invitation validation failed:', error)
    return NextResponse.json({ error: 'We could not verify this invitation. Please try again later.' }, { status: 500 })
  }
}
