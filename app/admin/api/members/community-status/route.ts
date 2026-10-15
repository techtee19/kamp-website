import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-session'
import { isSameOriginAdminRequest } from '@/lib/admin-request'
import { readJsonRequest, requestBodyErrorResponse } from '@/lib/request-body'
import { isMemberId } from '@/lib/member-id'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const bodySchema = z.object({
  memberId: z.string().refine(isMemberId, 'Invalid member ID.'),
  joined: z.boolean(),
})

export async function PATCH(request: NextRequest) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!isSameOriginAdminRequest(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })

  let body: unknown
  try {
    body = await readJsonRequest(request, 1024)
  } catch (error) {
    const issue = requestBodyErrorResponse(error)
    return NextResponse.json({ error: issue?.message ?? 'Invalid request body.' }, { status: issue?.status ?? 400 })
  }
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid update.' }, { status: 400 })

  try {
    const actor = parsed.data.joined ? process.env.ADMIN_EMAIL?.trim().toLowerCase() || 'KAMP admin' : null
    const rows = await db`
      INSERT INTO member_community_tracking (member_id, joined_at, joined_by, updated_at)
      SELECT member_id, ${parsed.data.joined ? new Date() : null}, ${actor}, NOW()
      FROM members WHERE member_id = ${parsed.data.memberId}
      ON CONFLICT (member_id) DO UPDATE
      SET joined_at = EXCLUDED.joined_at, joined_by = EXCLUDED.joined_by, updated_at = NOW()
      RETURNING member_id, joined_at
    `
    if (!rows.length) return NextResponse.json({ error: 'Member not found.' }, { status: 404 })
    return NextResponse.json({ success: true, joined: Boolean(rows[0].joined_at) }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Admin community status update failed:', error)
    return NextResponse.json({ error: 'Could not update the member’s community status.' }, { status: 500 })
  }
}
