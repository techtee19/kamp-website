import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { membershipSchema } from '@/lib/validations'
import { rateLimit, getClientIp } from '@/lib/ratelimit'
import { generateMemberCardPDF } from '@/lib/member-card'
import { sendMembershipWelcome } from '@/lib/email'

export const runtime = 'nodejs'

function currentLagosYear() {
  return Number(new Intl.DateTimeFormat('en', { timeZone: 'Africa/Lagos', year: 'numeric' }).format(new Date()))
}

export async function POST(req: NextRequest) {
  if (!rateLimit(getClientIp(req), 3, 60_000)) {
    return NextResponse.json({ error: 'Too many attempts. Please try again shortly.' }, { status: 429 })
  }

  try {
    const contentLength = Number(req.headers.get('content-length') ?? 0)
    if (contentLength > 16_384) return NextResponse.json({ error: 'Request is too large.' }, { status: 413 })
    const raw = await req.text()
    if (Buffer.byteLength(raw, 'utf8') > 16_384) return NextResponse.json({ error: 'Request is too large.' }, { status: 413 })
    let body: unknown
    try { body = JSON.parse(raw) } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }) }
    const parsed = membershipSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Please check the highlighted fields.', details: parsed.error.flatten().fieldErrors }, { status: 400 })

    const values = parsed.data
    const email = values.email.trim().toLowerCase()
    const yearJoined = currentLagosYear()

    const member = await db.begin(async (tx) => {
      const [{ last_number: lastNumber }] = await tx<{ last_number: number }[]>`
        INSERT INTO member_number_counters (year_joined, last_number) VALUES (${yearJoined}, 1)
        ON CONFLICT (year_joined) DO UPDATE SET last_number = member_number_counters.last_number + 1
        RETURNING last_number
      `
      const memberId = `KAMP/${yearJoined}/${String(lastNumber).padStart(5, '0')}`
      const [created] = await tx`
        INSERT INTO members (member_id, first_name, last_name, email, phone, university, gender, state_of_origin, study_level, why_join, year_joined)
        VALUES (${memberId}, ${values.firstName}, ${values.lastName}, ${email}, ${values.phone}, ${values.university}, ${values.gender}, ${values.stateOfOrigin}, ${values.studyLevel}, ${values.whyJoin}, ${yearJoined})
        RETURNING member_id, first_name, last_name, email, phone, university, gender, state_of_origin, study_level, why_join, status, year_joined, joined_at
      `
      return created
    })

    let emailSent = false
    try {
      const cardPDF = await generateMemberCardPDF({ firstName: member.first_name, lastName: member.last_name, memberId: member.member_id, university: member.university, yearJoined: member.year_joined })
      await sendMembershipWelcome({ to: email, firstName: member.first_name, memberId: member.member_id, cardPDF })
      emailSent = true
    } catch (error) { console.error('Membership welcome email failed:', error) }

    return NextResponse.json({ success: true, memberId: member.member_id, emailSent }, { status: 201 })
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === '23505') {
      return NextResponse.json({ error: 'An account with this email already exists. Check your inbox for your original member ID card.' }, { status: 409 })
    }
    console.error('[/api/membership] Error:', error)
    return NextResponse.json({ error: 'We could not complete your registration. Please try again.' }, { status: 500 })
  }
}
