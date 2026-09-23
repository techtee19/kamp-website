import { NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'
import { createEventRegistrationTable } from '@/lib/event-tables'

export const runtime = 'nodejs'

type EventWebhookPayload = {
  _id?: unknown
  _type?: unknown
  title?: unknown
  slug?: { current?: unknown }
  isPublished?: unknown
}

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_WEBHOOK_SECRET
  if (!secret) {
    console.error('[sanity/webhook] SANITY_WEBHOOK_SECRET is not set')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  try {
    const { body, isValidSignature } = await parseBody<EventWebhookPayload>(req, secret, false)

    if (isValidSignature !== true) {
      console.warn('[sanity/webhook] Invalid or missing signature — request rejected')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    if (!body) return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    if (body._type !== 'event' || body.isPublished !== true) {
      return NextResponse.json({ received: true }, { status: 200 })
    }

    if (
      typeof body._id !== 'string' ||
      body._id.length === 0 ||
      typeof body.slug?.current !== 'string' ||
      body.slug.current.length === 0 ||
      typeof body.title !== 'string' ||
      body.title.length === 0
    ) {
      return NextResponse.json({ error: 'Event payload is missing required fields' }, { status: 400 })
    }

    const result = await createEventRegistrationTable(body._id, body.slug.current, body.title)
    return NextResponse.json({ received: true, ...result }, { status: 200 })
  } catch (err) {
    console.error('[sanity/webhook] Error:', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
