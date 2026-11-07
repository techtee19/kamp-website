import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-session'
import { isSameOriginAdminRequest } from '@/lib/admin-request'
import { leaderCreateSchema } from '@/lib/leader-validations'
import { sendLeaderInvite } from '@/lib/email'
import { readJsonRequest } from '@/lib/request-body'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!isSameOriginAdminRequest(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  let body: unknown
  try { body = await readJsonRequest(request, 2048) } catch { return NextResponse.json({ error: 'Enter valid leader details.' }, { status: 400 }) }
  const parsed = leaderCreateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Check the leader details.' }, { status: 400 })
  const d = parsed.data; const email = d.email.toLowerCase()
  try {
    const [leader] = await db`INSERT INTO leaders (full_name,email,phone,role,campus) VALUES (${d.fullName},${email},${d.phone || null},${d.role},${d.campus}) RETURNING id`
    const portalUrl = `${process.env.NEXTAUTH_URL || request.nextUrl.origin}/leaders/login`
    let inviteSent = true
    try { await sendLeaderInvite({ to: email, fullName: d.fullName, role: d.role === 'executive' ? 'KAMP Executive' : 'Campus Leader', campus: d.campus, portalUrl }) }
    catch (emailError) { inviteSent = false; console.error('[admin/leaders] Leader created, invite email failed:', emailError) }
    return NextResponse.json({ success: true, id: leader.id, inviteSent, message: inviteSent ? `Leader added. Portal access instructions were emailed to ${email}.` : `Leader added, but the invite email could not be sent. The leader can request a sign-in link at /leaders/login.` }, { status: 201 })
  } catch (error) {
    const pgError = error as { code?: string }
    if (pgError.code === '23505') return NextResponse.json({ error: 'A leader already uses this email address.' }, { status: 409 })
    console.error('[admin/leaders] Failed to create leader:', error)
    return NextResponse.json({ error: 'Could not add this leader.' }, { status: 503 })
  }
}
