import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { membershipSchema } from '@/lib/validations'
import { rateLimit, getClientIp } from '@/lib/ratelimit'
import { generateMemberCardPDF } from '@/lib/member-card'
import { sendMembershipWelcome } from '@/lib/email'

export const runtime = 'nodejs'
const MAX_PHOTO_BYTES = 2 * 1024 * 1024

function currentLagosYear() {
  return Number(new Intl.DateTimeFormat('en', { timeZone: 'Africa/Lagos', year: 'numeric' }).format(new Date()))
}

export async function POST(req: NextRequest) {
  if (!rateLimit(getClientIp(req), 3, 60_000)) {
    return NextResponse.json({ error: 'Too many attempts. Please try again shortly.' }, { status: 429 })
  }

  try {
    if (!req.headers.get('content-type')?.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 415 })
    }
    const contentLength = Number(req.headers.get('content-length') ?? 0)
    if (contentLength > MAX_PHOTO_BYTES + 32_768) return NextResponse.json({ error: 'Photo must be 2 MB or smaller.' }, { status: 413 })
    const formData = await req.formData()
    const raw = formData.get('data')
    const photo = formData.get('passportPhoto')
    if (typeof raw !== 'string') return NextResponse.json({ error: 'Invalid registration data.' }, { status: 400 })
    let body: unknown
    try { body = JSON.parse(raw) } catch { return NextResponse.json({ error: 'Invalid registration data.' }, { status: 400 }) }
    const parsed = membershipSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Please check the highlighted fields.', details: parsed.error.flatten().fieldErrors }, { status: 400 })
    if (!(photo instanceof File) || photo.size === 0) {
      return NextResponse.json({ error: 'Please upload a passport-style photo.' }, { status: 400 })
    }
    if (photo.size > MAX_PHOTO_BYTES) return NextResponse.json({ error: 'Photo must be 2 MB or smaller.' }, { status: 413 })
    if (photo.type !== 'image/jpeg' && photo.type !== 'image/png') {
      return NextResponse.json({ error: 'Upload a JPG or PNG photo.' }, { status: 400 })
    }
    const photoBuffer = Buffer.from(await photo.arrayBuffer())
    const isJpeg = photoBuffer[0] === 0xff && photoBuffer[1] === 0xd8 && photoBuffer[2] === 0xff
    const isPng = photoBuffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    if (!(photo.type === 'image/jpeg' ? isJpeg : isPng)) {
      return NextResponse.json({ error: 'The selected file is not a valid JPG or PNG image.' }, { status: 400 })
    }
    const photoDataUri = `data:${photo.type};base64,${photoBuffer.toString('base64')}`

    const values = parsed.data
    const email = values.email.trim().toLowerCase()
    const yearJoined = currentLagosYear()

    const member = await db.begin(async (tx) => {
      const [{ last_number: lastNumber }] = await tx<{ last_number: number }[]>`
        INSERT INTO member_number_counters (year_joined, last_number) VALUES (${yearJoined}, 1)
        ON CONFLICT (year_joined) DO UPDATE SET last_number = member_number_counters.last_number + 1
        RETURNING last_number
      `
      const memberId = `KAMP-MBR-${yearJoined}-${String(lastNumber).padStart(5, '0')}`
      const [created] = await tx`
        INSERT INTO members (member_id, first_name, last_name, email, phone, university, gender, state_of_origin, study_level, why_join, year_joined)
        VALUES (${memberId}, ${values.firstName}, ${values.lastName}, ${email}, ${values.phone}, ${values.university}, ${values.gender}, ${values.stateOfOrigin}, ${values.studyLevel}, ${values.whyJoin}, ${yearJoined})
        RETURNING member_id, first_name, last_name, email, phone, university, gender, state_of_origin, study_level, why_join, status, year_joined, joined_at
      `
      return created
    })

    let emailSent = false
    try {
      const cardPDF = await generateMemberCardPDF({ firstName: member.first_name, lastName: member.last_name, memberId: member.member_id, university: member.university, yearJoined: member.year_joined, passportDataUri: photoDataUri })
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
