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
