import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { buildCsv } from '@/lib/admin-data'
import { getAdminSession } from '@/lib/admin-session'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: { 'Cache-Control': 'no-store' } })

  const requestedUniversity = request.nextUrl.searchParams.get('university')
  if (requestedUniversity !== null) {
    const university = requestedUniversity.trim()
    if (!university || university.length > 200) {
      return NextResponse.json({ error: 'Choose a valid university.' }, { status: 400, headers: { 'Cache-Control': 'no-store' } })
    }
    const rows = await db`
      WITH student_members AS (
        SELECT member_id, first_name, last_name, email, phone, study_level, kamp_position, status, joined_at,
          LOWER(BTRIM(REGEXP_REPLACE(
            REGEXP_REPLACE(
              BTRIM(TRANSLATE(university, CHR(160) || CHR(8239) || CHR(8217) || CHR(8216) || CHR(8211) || CHR(8212) || CHR(8209), '       ')),
              '[[:punct:]]+', ' ', 'g'
            ),
            '[[:space:]]+', ' ', 'g'
          ))) AS university_key
        FROM members
        WHERE membership_type = 'student' AND university IS NOT NULL AND BTRIM(university) <> ''
      )
      SELECT member_id, first_name, last_name, email, phone, study_level, kamp_position, status, joined_at
      FROM student_members
      WHERE university_key = LOWER(BTRIM(REGEXP_REPLACE(
        REGEXP_REPLACE(
          BTRIM(TRANSLATE(${university}, CHR(160) || CHR(8239) || CHR(8217) || CHR(8216) || CHR(8211) || CHR(8212) || CHR(8209), '       ')),
          '[[:punct:]]+', ' ', 'g'
        ),
        '[[:space:]]+', ' ', 'g'
      )))
      ORDER BY last_name ASC, first_name ASC
    `
    if (rows.length === 0) return NextResponse.json({ error: 'No student members found for that university.' }, { status: 404, headers: { 'Cache-Control': 'no-store' } })

    const csv = buildCsv(
      ['Member ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Study level', 'KAMP position', 'Status', 'Date joined'],
      rows.map((member) => [member.member_id, member.first_name, member.last_name, member.email, member.phone, member.study_level, member.kamp_position, member.status, new Date(member.joined_at as string).toLocaleDateString('en-NG')])
    )
    const safeUniversity = university.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'university'
    return new NextResponse(csv, { headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="kamp-${safeUniversity}-members-${new Date().toISOString().slice(0, 10)}.csv"`,
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
    } })
  }

  const members = await db`SELECT member_id, first_name, last_name, email, phone, membership_type, kamp_position, date_of_birth, university, study_level, occupation, organization, state_of_origin, gender, status, year_joined, joined_at FROM members ORDER BY joined_at DESC`
  const csv = buildCsv(
    ['Member ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Membership category', 'KAMP position', 'Date of birth', 'Tertiary institution', 'Study level', 'Profession or activity', 'Organization', 'State of origin', 'Gender', 'Status', 'Year joined', 'Date joined'],
    members.map((member) => [member.member_id, member.first_name, member.last_name, member.email, member.phone, member.membership_type, member.kamp_position, member.date_of_birth, member.university, member.study_level, member.occupation, member.organization, member.state_of_origin, member.gender, member.status, member.year_joined, new Date(member.joined_at as string).toLocaleDateString('en-NG')])
  )

  return new NextResponse(csv, { headers: {
    'Content-Type': 'text/csv; charset=utf-8',
    'Content-Disposition': `attachment; filename="kamp-members-${new Date().toISOString().slice(0, 10)}.csv"`,
    'Cache-Control': 'private, no-store',
    'X-Content-Type-Options': 'nosniff',
  } })
}
