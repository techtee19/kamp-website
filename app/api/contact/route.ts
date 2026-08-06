import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { contactSchema } from '@/lib/validations'
import { sendContactNotification } from '@/lib/email'
import { rateLimit, getClientIp } from '@/lib/ratelimit'

export async function POST(req: NextRequest) {
  try {
    // 0. Rate limit by client IP (backend.md §8)
    if (!rateLimit(getClientIp(req))) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // 1. Parse and validate
    const body = await req.json()
    const parsed = contactSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { name, email, subject, message } = parsed.data

    // 2. Store in database
    await db`
      INSERT INTO contact_submissions (name, email, subject, message)
      VALUES (${name}, ${email.toLowerCase()}, ${subject}, ${message})
    `

    // 3. Notify admin (fire and forget)
    sendContactNotification({ senderName: name, senderEmail: email, subject, message }).catch(
      (err) => console.error('Failed to send contact notification:', err)
    )

    return NextResponse.json(
      { success: true, message: "Message received! We'll get back to you soon." },
      { status: 201 }
    )
  } catch (err) {
    console.error('[/api/contact] Error:', err)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
