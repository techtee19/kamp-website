import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { rateLimit, getClientIp } from '@/lib/ratelimit'
import { hashCommunityLinkToken, isCommunityLinkToken, getWhatsAppCommunityLink } from '@/lib/community'
import { readJsonRequest } from '@/lib/request-body'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    if (!(await rateLimit(`community-join:${getClientIp(request)}`, 15, 60_000))) {
      return NextResponse.json({ error: 'Too many attempts. Please try again shortly.' }, { status: 429 })
    }
    const body: unknown = await readJsonRequest(request, 1024).catch(() => null)
    const token = typeof body === 'object' && body !== null && 'token' in body ? body.token : null
    if (!isCommunityLinkToken(token)) return NextResponse.json({ error: 'This KAMP join link is invalid.' }, { status: 400 })

    const rows = await db`
      UPDATE member_community_invite_links
      SET click_count = click_count + 1,
          first_clicked_at = COALESCE(first_clicked_at, NOW()),
          last_clicked_at = NOW()
      WHERE token_hash = ${hashCommunityLinkToken(token)}
      RETURNING id
    `
    if (rows.length === 0) return NextResponse.json({ error: 'This KAMP join link is no longer available. Please use the link in your latest membership email.' }, { status: 404 })

    return NextResponse.json({ url: getWhatsAppCommunityLink() }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('WhatsApp community link tracking failed:', error)
    return NextResponse.json({ error: 'We could not open the WhatsApp link. Please try again.' }, { status: 500 })
  }
}
