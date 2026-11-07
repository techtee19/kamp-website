import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-session'
import { isSameOriginAdminRequest } from '@/lib/admin-request'
import { leaderStatusSchema } from '@/lib/leader-validations'
import { readJsonRequest } from '@/lib/request-body'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!isSameOriginAdminRequest(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  const { id } = await params
  if (!/^\d+$/.test(id)) return NextResponse.json({ error: 'Leader not found.' }, { status: 404 })
  let body: unknown
  try { body = await readJsonRequest(request, 1024) } catch { return NextResponse.json({ error: 'Invalid status.' }, { status: 400 }) }
  const parsed = leaderStatusSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Choose active or inactive.' }, { status: 400 })
  const [leader] = await db`UPDATE leaders SET status = ${parsed.data.status} WHERE id = ${Number(id)} RETURNING id`
  return leader ? NextResponse.json({ success: true }) : NextResponse.json({ error: 'Leader not found.' }, { status: 404 })
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!isSameOriginAdminRequest(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  const { id } = await params
  if (!/^\d+$/.test(id)) return NextResponse.json({ error: 'Leader not found.' }, { status: 404 })
  try {
    const removed = await db.begin(async (tx) => {
      const [leader] = await tx`SELECT id FROM leaders WHERE id = ${Number(id)} FOR UPDATE`
      if (!leader) return false
      await tx`DELETE FROM leader_reports WHERE leader_id = ${Number(id)}`
      await tx`DELETE FROM leader_requests WHERE leader_id = ${Number(id)}`
      await tx`DELETE FROM leaders WHERE id = ${Number(id)}`
      return true
    })
    return removed ? NextResponse.json({ success: true }) : NextResponse.json({ error: 'Leader not found.' }, { status: 404 })
  } catch (error) {
    console.error('[admin/leaders] Failed to remove portal test data:', error)
    return NextResponse.json({ error: 'Could not delete this leader and their portal submissions.' }, { status: 503 })
  }
}
