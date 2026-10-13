import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-session'
import { isSameOriginAdminRequest } from '@/lib/admin-request'
import { readJsonRequest, requestBodyErrorResponse } from '@/lib/request-body'
import { isMemberId } from '@/lib/member-id'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const positionSchema = z.object({
  kampPosition: z.string().trim().min(2, 'Position must be at least 2 characters.').max(48, 'Position must be 48 characters or fewer.'),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ memberId: string }> },
) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!isSameOriginAdminRequest(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })

  const { memberId } = await params
  if (!isMemberId(memberId)) return NextResponse.json({ error: 'Invalid member ID.' }, { status: 400 })

  let body: unknown
  try {
    body = await readJsonRequest(request, 1024)
  } catch (error) {
    const issue = requestBodyErrorResponse(error)
    return NextResponse.json({ error: issue?.message ?? 'Invalid request body.' }, { status: issue?.status ?? 400 })
  }

  const parsed = positionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Enter a valid KAMP position.' }, { status: 400 })
  }

  try {
    const [member] = await db`
      UPDATE members
      SET kamp_position = ${parsed.data.kampPosition}
      WHERE member_id = ${memberId}
      RETURNING member_id, kamp_position
    `
    if (!member) return NextResponse.json({ error: 'Member not found.' }, { status: 404 })
    return NextResponse.json({ success: true, kampPosition: member.kamp_position }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Admin member position update failed:', error)
    return NextResponse.json({ error: 'Could not update the member position.' }, { status: 500 })
  }
}
