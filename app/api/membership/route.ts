import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
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

    const doc = {
      _type: 'member', memberId: member.member_id, firstName: member.first_name,
      lastName: member.last_name, email: member.email, phone: member.phone,
      university: member.university, gender: member.gender,
      stateOfOrigin: member.state_of_origin, studyLevel: member.study_level,
      whyJoin: member.why_join, status: member.status, yearJoined: member.year_joined,
      joinedAt: new Date(member.joined_at).toISOString(),
    }
    let sanitySynced = false
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    const privateDataset = process.env.NEXT_PUBLIC_SANITY_MEMBERS_DATASET
    const token = process.env.SANITY_API_TOKEN
    if (projectId && privateDataset && privateDataset !== process.env.NEXT_PUBLIC_SANITY_DATASET && token) {
      try {
        const sanity = createClient({ projectId, dataset: privateDataset, apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2026-08-15', token, useCdn: false })
        await sanity.create(doc)
        sanitySynced = true
      } catch (error) { console.error('Membership Sanity sync failed:', error) }
    } else {
      console.error('Membership Sanity sync skipped: private members dataset configuration is missing or points to the public dataset.')
    }

    let emailSent = false
    try {
      const cardPDF = await generateMemberCardPDF({ firstName: member.first_name, lastName: member.last_name, memberId: member.member_id, university: member.university, yearJoined: member.year_joined })
      await sendMembershipWelcome({ to: email, firstName: member.first_name, memberId: member.member_id, cardPDF })
      emailSent = true
    } catch (error) { console.error('Membership welcome email failed:', error) }

    return NextResponse.json({ success: true, memberId: member.member_id, sanitySynced, emailSent }, { status: 201 })
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === '23505') {
      return NextResponse.json({ error: 'An account with this email already exists. Check your inbox for your original member ID card.' }, { status: 409 })
    }
    console.error('[/api/membership] Error:', error)
    return NextResponse.json({ error: 'We could not complete your registration. Please try again.' }, { status: 500 })
  }
}
