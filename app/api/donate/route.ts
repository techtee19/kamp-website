import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { donationSchema } from '@/lib/validations'
import { initializeTransaction, generateReference } from '@/lib/paystack'
import { getClientIp, rateLimit } from '@/lib/ratelimit'
import { readJsonRequest, requestBodyErrorResponse } from '@/lib/request-body'

const MAX_REQUEST_BYTES = 4 * 1024

export async function POST(req: NextRequest) {
  try {
    if (!(await rateLimit(`donate:${getClientIp(req)}`, 5, 60_000))) {
      return NextResponse.json({ error: 'Too many attempts. Please try again shortly.' }, { status: 429 })
    }

    // 1. Parse and validate bounded request data
    const body = await readJsonRequest(req, MAX_REQUEST_BYTES)
    const parsed = donationSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { donorName, donorEmail, amountNgn, donationType, message } = parsed.data

    // 2. Generate a unique Paystack reference
    const reference = generateReference('kamp-donation')
    const amountKobo = Math.round(amountNgn * 100)

    // 3. Record the pending donation BEFORE handing the donor a checkout URL.
    //    If this ran after initialising Paystack and the insert failed, the
    //    donor could still complete a payment we have no record of, and the
    //    webhook's UPDATE would silently match zero rows.
    await db`
      INSERT INTO donations
        (paystack_ref, donor_name, donor_email, amount_kobo, amount_ngn, donation_type, status, message)
      VALUES
        (${reference}, ${donorName}, ${donorEmail.toLowerCase()}, ${amountKobo}, ${amountNgn}, ${donationType}, 'pending', ${message ?? null})
    `

    // 4. Initialise the Paystack transaction
    let authorizationUrl: string
    try {
      const paystackRes = await initializeTransaction({
        email: donorEmail,
        amount: amountKobo,
        reference,
        callback_url: `${process.env.NEXTAUTH_URL}/donate/success`,
        metadata: {
          donor_name: donorName,
          donation_type: donationType,
          message: message ?? '',
          custom_fields: [
            { display_name: 'Donor Name', variable_name: 'donor_name', value: donorName },
            {
              display_name: 'Donation Type',
              variable_name: 'donation_type',
              value: donationType,
            },
          ],
        },
      })
      authorizationUrl = paystackRes.data.authorization_url
    } catch (err) {
      // Paystack never issued a checkout session, so this reference can never
      // be paid. Mark it failed rather than leaving it pending forever.
      await db`
        UPDATE donations SET status = 'failed' WHERE paystack_ref = ${reference}
      `.catch((dbErr) => console.error('[/api/donate] Failed to mark donation failed:', dbErr))
      throw err
    }

    // 5. Return the Paystack checkout URL to the client
    return NextResponse.json({ authorizationUrl }, { status: 200 })
  } catch (err) {
    const bodyError = requestBodyErrorResponse(err)
    if (bodyError) return NextResponse.json({ error: bodyError.message }, { status: bodyError.status })
    console.error('[/api/donate] Error:', err)
    return NextResponse.json(
      { error: 'Failed to initialise payment. Please try again.' },
      { status: 500 }
    )
  }
}
