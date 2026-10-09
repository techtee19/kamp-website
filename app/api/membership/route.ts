import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { membershipSchema } from '@/lib/validations'
import { rateLimit, getClientIp } from '@/lib/ratelimit'
import { generateMemberCardPDF } from '@/lib/member-card'
import { sendMembershipWelcome } from '@/lib/email'
import { readRequestBytes, RequestBodyTooLargeError } from '@/lib/request-body'

export const runtime = 'nodejs'
const MAX_PHOTO_BYTES = 2 * 1024 * 1024
const MAX_REQUEST_BYTES = MAX_PHOTO_BYTES + 32_768
const MAX_IMAGE_DIMENSION = 8_000
const MAX_IMAGE_PIXELS = 25_000_000

function readImageDimensions(buffer: Buffer, mimeType: string): { width: number; height: number } | null {
  if (mimeType === 'image/png') {
    if (buffer.length < 24 || buffer.toString('ascii', 12, 16) !== 'IHDR') return null
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) }
  }

  if (mimeType !== 'image/jpeg' || buffer.length < 4) return null
  const startOfFrameMarkers = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf])
  let offset = 2
  while (offset + 4 < buffer.length) {
    if (buffer[offset] !== 0xff) return null
    while (buffer[offset] === 0xff) offset++
    const marker = buffer[offset++]
    if (marker === 0xd9 || marker === 0xda) break
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue
    if (offset + 2 > buffer.length) return null
    const segmentLength = buffer.readUInt16BE(offset)
    if (segmentLength < 2 || offset + segmentLength > buffer.length) return null
    if (startOfFrameMarkers.has(marker)) {
      if (segmentLength < 7) return null
      return { height: buffer.readUInt16BE(offset + 3), width: buffer.readUInt16BE(offset + 5) }
    }
    offset += segmentLength
  }
  return null
}

function currentLagosYear() {
  return Number(new Intl.DateTimeFormat('en', { timeZone: 'Africa/Lagos', year: 'numeric' }).format(new Date()))
}

export async function POST(req: NextRequest) {
  if (!(await rateLimit(`membership:${getClientIp(req)}`, 3, 60_000))) {
    return NextResponse.json({ error: 'Too many attempts. Please try again shortly.' }, { status: 429 })
  }

  try {
    if (req.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase() !== 'multipart/form-data') {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 415 })
    }
    const requestBytes = await readRequestBytes(req, MAX_REQUEST_BYTES)
    const requestHeaders = new Headers(req.headers)
    requestHeaders.delete('content-length')
    requestHeaders.delete('transfer-encoding')
    const boundedRequest = new Request(req.url, { method: 'POST', headers: requestHeaders, body: new Uint8Array(requestBytes) })
    const formData = await boundedRequest.formData()
    const raw = formData.get('data')
    const photo = formData.get('passportPhoto')
    if (typeof raw !== 'string') return NextResponse.json({ error: 'Invalid registration data.' }, { status: 400 })
    if (Buffer.byteLength(raw, 'utf8') > 16 * 1024) return NextResponse.json({ error: 'Registration details are too large.' }, { status: 413 })
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
    const dimensions = readImageDimensions(photoBuffer, photo.type)
    if (
      !dimensions ||
      dimensions.width < 1 || dimensions.height < 1 ||
      dimensions.width > MAX_IMAGE_DIMENSION || dimensions.height > MAX_IMAGE_DIMENSION ||
      dimensions.width * dimensions.height > MAX_IMAGE_PIXELS
    ) {
      return NextResponse.json({ error: 'The image is invalid or its dimensions are too large.' }, { status: 400 })
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
        INSERT INTO members (member_id, first_name, last_name, email, phone, university, gender, state_of_origin, study_level, why_join, year_joined, passport_photo, passport_photo_type)
        VALUES (${memberId}, ${values.firstName}, ${values.lastName}, ${email}, ${values.phone}, ${values.university}, ${values.gender}, ${values.stateOfOrigin}, ${values.studyLevel}, ${values.whyJoin}, ${yearJoined}, ${photoBuffer}, ${photo.type})
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
    if (error instanceof RequestBodyTooLargeError) {
      return NextResponse.json({ error: 'The upload must be 2 MB or smaller.' }, { status: 413 })
    }
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === '23505') {
      return NextResponse.json({ error: 'An account with this email already exists. Check your inbox for your original member ID card.' }, { status: 409 })
    }
    console.error('[/api/membership] Error:', error)
    return NextResponse.json({ error: 'We could not complete your registration. Please try again.' }, { status: 500 })
  }
}
