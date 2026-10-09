import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-session'
import { isSameOriginAdminRequest } from '@/lib/admin-request'
import { readJsonRequest, requestBodyErrorResponse } from '@/lib/request-body'
import { generateMemberCardPDF } from '@/lib/member-card'
import { sendMembershipWelcome } from '@/lib/email'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
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
    const [member] = await db`
      SELECT member_id, first_name, last_name, email, university, year_joined,
        joined_at, passport_photo, passport_photo_type
      FROM members WHERE member_id = ${memberId} LIMIT 1
    `
    if (!member) return NextResponse.json({ error: 'Member not found.' }, { status: 404 })
    const photo = member.passport_photo
    const photoType = member.passport_photo_type
    const photoAvailable = Buffer.isBuffer(photo) && photo.length > 0 && (photoType === 'image/jpeg' || photoType === 'image/png')
    const cardPDF = await generateMemberCardPDF({
      firstName: member.first_name as string,
      lastName: member.last_name as string,
      memberId: member.member_id as string,
      university: member.university as string,
      yearJoined: member.year_joined as number,
      ...(photoAvailable ? { passportDataUri: `data:${photoType};base64,${photo.toString('base64')}` } : {}),
    })
    await sendMembershipWelcome({ to: member.email as string, firstName: member.first_name as string, memberId: member.member_id as string, cardPDF })
    return NextResponse.json({ success: true, photoAvailable }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Admin membership card resend failed:', error)
    return NextResponse.json({ error: 'Could not resend the member ID card.' }, { status: 500 })
  }
}
