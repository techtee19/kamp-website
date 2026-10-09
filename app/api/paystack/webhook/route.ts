import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyWebhookSignature } from '@/lib/paystack'
import { sendDonationReceipt } from '@/lib/email'
import { parseJsonBytes, readRequestBytes, RequestBodyTooLargeError } from '@/lib/request-body'

// Runs on the Node.js runtime — `crypto` (signature verification) and the
// `postgres` driver are both unavailable on the Edge runtime.
export const runtime = 'nodejs'
const MAX_WEBHOOK_BYTES = 256 * 1024

// NOTE: backend.md shows `export const config = { api: { bodyParser: false } }`
// here. That is a Pages Router API-route option and has no effect in the App
// Router — Route Handlers never pre-parse the body, so `req.text()` already
// returns the exact raw bytes the signature was computed over. It is omitted
// deliberately rather than skipped by accident.

export async function POST(req: NextRequest) {
  let rawBody: Buffer
  try {
    rawBody = await readRequestBytes(req, MAX_WEBHOOK_BYTES)
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return NextResponse.json({ error: 'Webhook request is too large.' }, { status: 413 })
    }
    return NextResponse.json({ error: 'Invalid webhook request.' }, { status: 400 })
  }

  // Verify the signature against the exact request bytes before parsing JSON.
  const signature = req.headers.get('x-paystack-signature') ?? ''
  if (!verifyWebhookSignature(rawBody, signature)) {
    console.warn('[paystack/webhook] Invalid signature — rejected')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let event: unknown
  try {
    event = parseJsonBytes(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid webhook JSON.' }, { status: 400 })
  }

  if (typeof event !== 'object' || event === null || !('event' in event) || typeof event.event !== 'string') {
    return NextResponse.json({ error: 'Invalid webhook payload.' }, { status: 400 })
  }

  // Acknowledge event types that this endpoint does not process.
  if (event.event !== 'charge.success') return NextResponse.json({ received: true }, { status: 200 })

  if (!('data' in event) || typeof event.data !== 'object' || event.data === null) {
    return NextResponse.json({ error: 'Invalid charge payload.' }, { status: 400 })
  }
  const data = event.data
  if (
    !('reference' in data) || typeof data.reference !== 'string' ||
    !/^[A-Za-z0-9_-]{1,100}$/.test(data.reference) ||
    !('status' in data) || data.status !== 'success' ||
    !('currency' in data) || data.currency !== 'NGN' ||
    !('amount' in data) || typeof data.amount !== 'number' || !Number.isSafeInteger(data.amount) || data.amount < 1
  ) {
    return NextResponse.json({ error: 'Invalid charge details.' }, { status: 400 })
  }
  const reference = data.reference

  try {
    const existing = await db`
      SELECT id, status, receipt_sent, amount_kobo
      FROM donations
      WHERE paystack_ref = ${reference}
      LIMIT 1
    `

    if (existing.length === 0) {
      // Signature was valid, so this is a genuine Paystack event for a
      // reference we never recorded. Log loudly — it means a payment exists
      // with no matching row.
      console.error(`[webhook] No donation row for verified ref ${reference}`)
      return NextResponse.json({ received: true }, { status: 200 })
    }

    if (existing[0].status === 'success' && existing[0].receipt_sent) {
      console.log(`[webhook] Duplicate event for ref ${reference} — skipping`)
      return NextResponse.json({ received: true }, { status: 200 })
    }

    // Never mark an underpaid or otherwise mismatched transaction successful.
    if (data.amount !== existing[0].amount_kobo) {
      console.warn(
        `[webhook] Amount mismatch for ${reference}: charged ${data.amount} kobo, recorded ${existing[0].amount_kobo} kobo`
      )
      return NextResponse.json({ received: true, ignored: true }, { status: 200 })
    }

    const paidAt = 'paid_at' in data && typeof data.paid_at === 'string' && Number.isFinite(Date.parse(data.paid_at))
      ? data.paid_at
      : new Date().toISOString()

    await db`
      UPDATE donations
      SET
        status = 'success',
        paystack_status = ${data.status},
        paid_at = ${paidAt}
      WHERE paystack_ref = ${reference}
    `

    // 7. Claim the receipt atomically, then send.
    //    Flipping receipt_sent in the same statement that tests it means two
    //    concurrent deliveries of the same event cannot both win the claim, so
    //    the donor never receives two receipts.
    const claimed = await db`
      UPDATE donations
      SET receipt_sent = TRUE
      WHERE paystack_ref = ${reference}
        AND receipt_sent = FALSE
      RETURNING donor_name, donor_email, amount_ngn
    `

    if (claimed.length > 0) {
      const { donor_name, donor_email, amount_ngn } = claimed[0] as {
        donor_name: string
        donor_email: string
        amount_ngn: string | number
      }

      try {
        await sendDonationReceipt({
          to: donor_email,
          donorName: donor_name,
          // postgres.js returns NUMERIC columns as strings to preserve
          // precision — coerce so toLocaleString actually formats the amount.
          amountNgn: Number(amount_ngn),
          paystackRef: reference,
          paidAt: new Date(paidAt).toLocaleDateString('en-NG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        })
      } catch (mailErr) {
        // Release the claim so the next Paystack retry can send it.
        console.error(`[webhook] Receipt send failed for ${reference}:`, mailErr)
        await db`
          UPDATE donations SET receipt_sent = FALSE WHERE paystack_ref = ${reference}
        `.catch((dbErr) => console.error('[webhook] Failed to release receipt claim:', dbErr))
        return NextResponse.json({ error: 'Receipt delivery failed; retry requested.' }, { status: 500 })
      }
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (err) {
    console.error('[/api/paystack/webhook] Processing failed:', err instanceof Error ? err.message : 'Unknown error')
    return NextResponse.json({ error: 'Webhook processing failed; retry requested.' }, { status: 500 })
  }
}
