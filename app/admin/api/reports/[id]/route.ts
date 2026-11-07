import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-session'
import { isSameOriginAdminRequest } from '@/lib/admin-request'

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!isSameOriginAdminRequest(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  const { id } = await params
  if (!/^\d+$/.test(id)) return NextResponse.json({ error: 'Report not found.' }, { status: 404 })
  try {
    const [row] = await db`DELETE FROM leader_reports WHERE id = ${Number(id)} RETURNING id`
    return row ? NextResponse.json({ success: true }) : NextResponse.json({ error: 'Report not found.' }, { status: 404 })
  } catch (error) {
    console.error('[admin/reports] Failed to delete report:', error)
    return NextResponse.json({ error: 'Could not delete this report.' }, { status: 503 })
  }
}
