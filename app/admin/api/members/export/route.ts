import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { buildCsv } from '@/lib/admin-data'
import { getAdminSession } from '@/lib/admin-session'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: { 'Cache-Control': 'no-store' } })

  const members = await db`SELECT member_id, first_name, last_name, email, phone, university, study_level, state_of_origin, gender, status, year_joined, joined_at FROM members ORDER BY joined_at DESC`
  const csv = buildCsv(
    ['Member ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Tertiary institution', 'Study level', 'State of origin', 'Gender', 'Status', 'Year joined', 'Date joined'],
    members.map((member) => [member.member_id, member.first_name, member.last_name, member.email, member.phone, member.university, member.study_level, member.state_of_origin, member.gender, member.status, member.year_joined, new Date(member.joined_at as string).toLocaleDateString('en-NG')])
  )

  return new NextResponse(csv, { headers: {
    'Content-Type': 'text/csv; charset=utf-8',
    'Content-Disposition': `attachment; filename="kamp-members-${new Date().toISOString().slice(0, 10)}.csv"`,
    'Cache-Control': 'private, no-store',
    'X-Content-Type-Options': 'nosniff',
  } })
}
