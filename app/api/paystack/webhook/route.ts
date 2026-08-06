import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyWebhookSignature } from '@/lib/paystack'
import { sendDonationReceipt } from '@/lib/email'

// Runs on the Node.js runtime — `crypto` (signature verification) and the
// `postgres` driver are both unavailable on the Edge runtime.
export const runtime = 'nodejs'

// NOTE: backend.md shows `export const config = { api: { bodyParser: false } }`
// here. That is a Pages Router API-route option and has no effect in the App
// Router — Route Handlers never pre-parse the body, so `req.text()` already
// returns the exact raw bytes the signature was computed over. It is omitted
// deliberately rather than skipped by accident.

export async function POST(req: NextRequest) {
  try {
    // 1. Read the raw body as text
    const rawBody = await req.text()

    // 2. Verify the Paystack signature
    const signature = req.headers.get('x-paystack-signature') ?? ''
    const isValid = verifyWebhookSignature(rawBody, signature)

    if (!isValid) {
      console.warn('[webhook] Invalid Paystack signature — rejected')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    // 3. Parse the event
    const event = JSON.parse(rawBody)

    // 4. Only handle charge.success events
    if (event.event !== 'charge.success') {
      // Acknowledge other events so Paystack doesn't retry
      return NextResponse.json({ received: true }, { status: 200 })
    }

    const data = event.data
    const reference = data.reference as string

    // 5. Idempotency fast-path — fully processed already, nothing left to do.
    //    Note this only skips when the receipt also went out; a row that is
    //    'success' but never got its receipt (e.g. Resend was down) still falls
    //    through so a Paystack retry can deliver it.
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

    // Cross-check the charged amount against what we initialised the
    // transaction with. Mismatches are logged, not fatal — the receipt is
    // always built from our own record, never from webhook input.
    if (typeof data.amount === 'number' && data.amount !== existing[0].amount_kobo) {
      console.warn(
        `[webhook] Amount mismatch for ${reference}: charged ${data.amount} kobo, recorded ${existing[0].amount_kobo} kobo`
      )
    }

    // 6. Update the donation record
    const paidAt = data.paid_at ?? new Date().toISOString()

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
      }
    }

    // 8. Always return 200 — Paystack retries on non-200
    return NextResponse.json({ received: true }, { status: 200 })
  } catch (err) {
    console.error('[/api/paystack/webhook] Error:', err)
    // Still return 200 to prevent Paystack retrying a bad request
    return NextResponse.json({ received: true }, { status: 200 })
  }
}
