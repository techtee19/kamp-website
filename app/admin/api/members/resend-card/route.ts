import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-session'
import { isSameOriginAdminRequest } from '@/lib/admin-request'
import { readJsonRequest, requestBodyErrorResponse } from '@/lib/request-body'
import { generateMemberCardPDF } from '@/lib/member-card'
import { sendMembershipWelcome } from '@/lib/email'
import { isMemberId } from '@/lib/member-id'
import { createCommunityLinkToken, createTrackedCommunityUrl, hashCommunityLinkToken, getSiteOrigin } from '@/lib/community'

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
  if (typeof memberId !== 'string' || !isMemberId(memberId)) return NextResponse.json({ error: 'Invalid member ID.' }, { status: 400 })

  let stage: 'member lookup' | 'card generation' | 'email delivery' = 'member lookup'
  try {
    const [member] = await db`
      SELECT member_id, first_name, last_name, email, membership_type, kamp_position, university, occupation, organization, year_joined,
        joined_at, passport_photo, passport_photo_type
      FROM members WHERE member_id = ${memberId} LIMIT 1
    `
    if (!member) return NextResponse.json({ error: 'Member not found.' }, { status: 404 })
    const communityToken = createCommunityLinkToken()
    const communityTokenHash = hashCommunityLinkToken(communityToken)
    let communityTrackingReady = false
    try {
      await db.begin(async (tx) => {
        await tx`
          INSERT INTO member_community_tracking (member_id)
          VALUES (${memberId})
          ON CONFLICT (member_id) DO NOTHING
        `
        await tx`
          INSERT INTO member_community_invite_links (member_id, token_hash)
          VALUES (${memberId}, ${communityTokenHash})
        `
      })
      communityTrackingReady = true
    } catch (error) {
      console.error('Could not initialize WhatsApp follow-up tracking for resent card:', error)
    }
    stage = 'card generation'
    const photo = member.passport_photo
    const photoType = member.passport_photo_type
    const photoAvailable = Buffer.isBuffer(photo) && photo.length > 0 && (photoType === 'image/jpeg' || photoType === 'image/png')
    const cardPDF = await generateMemberCardPDF({
      firstName: member.first_name as string,
      lastName: member.last_name as string,
      memberId: member.member_id as string,
      membershipType: member.membership_type as string,
      kampPosition: (member.kamp_position as string | null) ?? 'General Member',
      affiliation: member.membership_type === 'student'
        ? String(member.university ?? 'Student')
        : [member.occupation, member.organization].filter(Boolean).join(' · ') || 'KAMP Community',
      yearJoined: member.year_joined as number,
      ...(photoAvailable ? { passportDataUri: `data:${photoType};base64,${photo.toString('base64')}` } : {}),
    })
    stage = 'email delivery'
    await sendMembershipWelcome({ to: member.email as string, firstName: member.first_name as string, memberId: member.member_id as string, cardPDF, ...(communityTrackingReady ? { communityJoinUrl: createTrackedCommunityUrl(communityToken, getSiteOrigin(request.nextUrl.origin)) } : {}) })
    if (communityTrackingReady) try {
      await db`UPDATE member_community_invite_links SET email_sent_at = NOW() WHERE token_hash = ${communityTokenHash}`
    } catch (error) {
      console.error('Could not record community link email delivery:', error)
    }
    return NextResponse.json({ success: true, photoAvailable, communityTrackingReady }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error(`Admin membership card resend failed during ${stage}:`, error)
    if (stage === 'email delivery') {
      const message = error instanceof Error ? error.message : ''
      if (/api key is invalid/i.test(message)) {
        return NextResponse.json({ error: 'Resend rejected the API key. Check RESEND_API_KEY in the deployment environment.' }, { status: 502 })
      }
      if (/missing api key|api key.*required/i.test(message)) {
        return NextResponse.json({ error: 'Email sending is not configured. Add RESEND_API_KEY to the deployment environment.' }, { status: 503 })
      }
      if (/sender|from address|domain.*verified|verify.*domain/i.test(message)) {
        return NextResponse.json({ error: 'Resend rejected the sender address. Check that EMAIL_FROM uses a verified domain in Resend.' }, { status: 502 })
      }
      return NextResponse.json({ error: 'The card was generated, but email delivery failed. Check the deployment logs and Resend email logs for the provider error.' }, { status: 502 })
    }
    if (stage === 'card generation') {
      return NextResponse.json({ error: 'The member was found, but card PDF generation failed. Check the deployment logs.' }, { status: 500 })
    }
    return NextResponse.json({ error: 'Could not load the member record. Check the database connection and deployment logs.' }, { status: 500 })
  }
}
