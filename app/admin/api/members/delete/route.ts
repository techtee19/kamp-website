import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-session'
import { isSameOriginAdminRequest } from '@/lib/admin-request'
import { readJsonRequest, requestBodyErrorResponse } from '@/lib/request-body'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function DELETE(request: NextRequest) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!isSameOriginAdminRequest(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  let body: unknown
  try { body = await readJsonRequest(request, 1024) } catch (error) {
    const issue = requestBodyErrorResponse(error)
    return NextResponse.json({ error: issue?.message ?? 'Invalid request body.' }, { status: issue?.status ?? 400 })
  }
  const memberId = typeof body === 'object' && body !== null && 'memberId' in body ? body.memberId : null
  if (typeof memberId !== 'string' || !/^KAMP-MBR-\d{4}-\d{5}$/.test(memberId)) return NextResponse.json({ error: 'Invalid member ID.' }, { status: 400 })

  try {
    const deleted = await db`DELETE FROM members WHERE member_id = ${memberId} RETURNING member_id`
    if (deleted.length === 0) return NextResponse.json({ error: 'Member not found.' }, { status: 404 })
    return NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Admin member delete failed:', error)
    return NextResponse.json({ error: 'Could not delete this member.' }, { status: 500 })
  }
}
