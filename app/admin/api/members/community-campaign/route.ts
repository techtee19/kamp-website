import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-session'
import { isSameOriginAdminRequest } from '@/lib/admin-request'
import { readJsonRequest } from '@/lib/request-body'
import { sendCommunityInvitation } from '@/lib/email'
import { createCommunityLinkToken, createTrackedCommunityUrl, getSiteOrigin, hashCommunityLinkToken } from '@/lib/community'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const CAMPAIGN_KEY = 'whatsapp-community-follow-up-2026-10'
const BATCH_SIZE = 5

async function campaignCounts() {
  const [counts] = await db`
    SELECT COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE status = 'pending')::int AS pending,
      COUNT(*) FILTER (WHERE status = 'sending')::int AS sending,
      COUNT(*) FILTER (WHERE status = 'sent')::int AS sent,
      COUNT(*) FILTER (WHERE status = 'failed')::int AS failed
    FROM community_email_campaign_recipients WHERE campaign_key = ${CAMPAIGN_KEY}
  `
  return counts
}

export async function POST(request: NextRequest) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!isSameOriginAdminRequest(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })

  let body: unknown
  try { body = await readJsonRequest(request, 1024) } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }
  const action = typeof body === 'object' && body !== null && 'action' in body ? body.action : null
  if (action !== 'start' && action !== 'send-batch' && action !== 'retry-failed') {
    return NextResponse.json({ error: 'Invalid campaign action.' }, { status: 400 })
  }

  try {
    const [schema] = await db`
      SELECT to_regclass('public.community_email_campaign_recipients') IS NOT NULL AS campaign_ready,
        to_regclass('public.member_community_tracking') IS NOT NULL AS tracking_ready,
        to_regclass('public.member_community_invite_links') IS NOT NULL AS links_ready
    `
    if (!schema?.campaign_ready || !schema?.tracking_ready || !schema?.links_ready) {
      return NextResponse.json({ error: 'Apply migrations 013_member_engagement_tracking.sql and 014_community_email_campaign.sql to the production database first.' }, { status: 503 })
    }

    if (action === 'start') {
      await db`
        INSERT INTO community_email_campaign_recipients (campaign_key, member_id)
        SELECT ${CAMPAIGN_KEY}, member_id FROM members
        ON CONFLICT (campaign_key, member_id) DO NOTHING
      `
      return NextResponse.json({ success: true, counts: await campaignCounts() }, { headers: { 'Cache-Control': 'no-store' } })
    }

    if (action === 'retry-failed') {
      await db`
        UPDATE community_email_campaign_recipients
        SET status = 'pending', last_error = NULL, updated_at = NOW()
        WHERE campaign_key = ${CAMPAIGN_KEY} AND status = 'failed'
      `
      return NextResponse.json({ success: true, counts: await campaignCounts() }, { headers: { 'Cache-Control': 'no-store' } })
    }

    const claimed = await db.begin(async (tx) => tx`
      WITH batch AS (
        SELECT member_id FROM community_email_campaign_recipients
        WHERE campaign_key = ${CAMPAIGN_KEY} AND status = 'pending'
        ORDER BY created_at, member_id LIMIT ${BATCH_SIZE}
        FOR UPDATE SKIP LOCKED
      )
      UPDATE community_email_campaign_recipients AS recipient
      SET status = 'sending', attempt_count = attempt_count + 1, updated_at = NOW()
      FROM batch, members
      WHERE recipient.campaign_key = ${CAMPAIGN_KEY}
        AND recipient.member_id = batch.member_id AND members.member_id = batch.member_id
      RETURNING recipient.member_id, members.first_name, members.email
    `)

    let batchSent = 0
    let batchFailed = 0
    for (const member of claimed) {
      const memberId = member.member_id as string
      const token = createCommunityLinkToken()
      const tokenHash = hashCommunityLinkToken(token)
      const trackedUrl = createTrackedCommunityUrl(token, getSiteOrigin(request.nextUrl.origin))
      try {
        await db.begin(async (tx) => {
          await tx`INSERT INTO member_community_tracking (member_id) VALUES (${memberId}) ON CONFLICT (member_id) DO NOTHING`
          await tx`INSERT INTO member_community_invite_links (member_id, token_hash) VALUES (${memberId}, ${tokenHash})`
        })
        await sendCommunityInvitation({ to: member.email as string, firstName: member.first_name as string, communityJoinUrl: trackedUrl })
        await db.begin(async (tx) => {
          await tx`UPDATE member_community_invite_links SET email_sent_at = NOW() WHERE token_hash = ${tokenHash}`
          await tx`
            UPDATE community_email_campaign_recipients
            SET status = 'sent', sent_at = NOW(), last_error = NULL, updated_at = NOW()
            WHERE campaign_key = ${CAMPAIGN_KEY} AND member_id = ${memberId}
          `
        })
        batchSent += 1
      } catch (error) {
        const message = error instanceof Error ? error.message.slice(0, 500) : 'Unknown email delivery error'
        console.error('[admin community email campaign] Delivery failed for one recipient:', message)
        await db`
          UPDATE community_email_campaign_recipients
          SET status = 'failed', last_error = ${message}, updated_at = NOW()
          WHERE campaign_key = ${CAMPAIGN_KEY} AND member_id = ${memberId}
        `
        batchFailed += 1
      }
    }

    return NextResponse.json({ success: true, batchSent, batchFailed, counts: await campaignCounts() }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('[admin community email campaign] Request failed:', error)
    return NextResponse.json({ error: 'The campaign could not run. Check the database and deployment logs.' }, { status: 500 })
  }
}
