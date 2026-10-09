import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { parseBody } from 'next-sanity/webhook'
import { createEventRegistrationTable } from '@/lib/event-tables'
import { readRequestBytes, RequestBodyTooLargeError } from '@/lib/request-body'

export const runtime = 'nodejs'
const MAX_WEBHOOK_BYTES = 128 * 1024

type EventSnapshot = {
  _type?: unknown
  _id?: unknown
  title?: unknown
  slug?: { current?: unknown }
  isPublished?: unknown
}

type EventWebhookPayload = EventSnapshot & {
  before?: EventSnapshot | null
  after?: EventSnapshot | null
}

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_WEBHOOK_SECRET
  if (!secret) {
    console.error('[sanity/webhook] SANITY_WEBHOOK_SECRET is not set')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  try {
    const rawBody = await readRequestBytes(req, MAX_WEBHOOK_BYTES)
    const boundedHeaders = new Headers(req.headers)
    boundedHeaders.delete('content-length')
    boundedHeaders.delete('transfer-encoding')
    const boundedRequest = new NextRequest(req.url, { method: 'POST', headers: boundedHeaders, body: new Uint8Array(rawBody) })

    // Wait for Sanity's Content Lake to become consistent before the next page
    // request refreshes its cached event data.
    const { body, isValidSignature } = await parseBody<EventWebhookPayload>(boundedRequest, secret, true)

    if (isValidSignature !== true) {
      console.warn('[sanity/webhook] Invalid or missing signature — request rejected')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    if (!body) return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    const snapshots = [body.before, body.after, body].filter((value): value is EventSnapshot => value !== null && typeof value === 'object')
    if (!snapshots.some((snapshot) => snapshot._type === 'event')) {
      return NextResponse.json({ received: true }, { status: 200 })
    }

    const slugs = new Set<string>()
    for (const snapshot of snapshots) {
      const slug = snapshot.slug?.current
      if (typeof slug === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) slugs.add(slug)
    }

    const paths = ['/', '/events', '/events/[slug]']
    for (const slug of slugs) paths.push(`/events/${slug}`)
    revalidatePath('/')
    revalidatePath('/events')
    revalidatePath('/events/[slug]', 'page')
    for (const slug of slugs) revalidatePath(`/events/${slug}`)

    // Keep the existing registration-table provisioning for published events.
    // Unpublishing and deleting still revalidate the website above.
    const current = body.after ?? body
    let registrationTable: Awaited<ReturnType<typeof createEventRegistrationTable>> | undefined
    if (current.isPublished === true) {
      if (
        typeof current._id !== 'string' || current._id.length === 0 ||
        typeof current.slug?.current !== 'string' || current.slug.current.length === 0 ||
        typeof current.title !== 'string' || current.title.length === 0
      ) {
        return NextResponse.json({ error: 'Published event payload is missing required fields' }, { status: 400 })
      }
      registrationTable = await createEventRegistrationTable(current._id, current.slug.current, current.title)
    }

    console.info(`[sanity/webhook] Revalidated event paths: ${paths.join(', ')}`)
    return NextResponse.json({ received: true, revalidated: paths, ...(registrationTable ?? {}) }, { status: 200 })
  } catch (err) {
    if (err instanceof RequestBodyTooLargeError) {
      return NextResponse.json({ error: 'Webhook request is too large.' }, { status: 413 })
    }
    console.error('[sanity/webhook] Error:', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
