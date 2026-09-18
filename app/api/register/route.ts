import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { registrationSchema } from '@/lib/validations'
import { client } from '@/sanity/lib/client'
import { EVENT_BY_ID_QUERY } from '@/sanity/lib/queries'
import { sendRegistrationConfirmation } from '@/lib/email'
import { rateLimit, getClientIp } from '@/lib/ratelimit'
import { generateTicketPDF, generateTicketRef, type TicketData } from '@/lib/ticket'

export async function POST(req: NextRequest) {
  try {
    if (!client) {
      console.error('[/api/register] Missing NEXT_PUBLIC_SANITY_PROJECT_ID')
      return NextResponse.json(
        { error: 'Event registration is temporarily unavailable. Please try again later.' },
        { status: 503 }
      )
    }

    // 0. Rate limit by client IP (backend.md §8)
    if (!rateLimit(getClientIp(req))) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // 1. Parse and validate body
    const body = await req.json()
    const parsed = registrationSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { eventId, eventTitle, fullName, email, phone, university, studyLevel } = parsed.data
    const normalisedEmail = email.toLowerCase()

    // 2. Check capacity if the event has a limit
    const event = await client.fetch<{
      capacity?: number
      date: string
      location: string
      university: string
      theme?: string
    } | null>(EVENT_BY_ID_QUERY, { id: eventId })

    if (event?.capacity) {
      const result = await db`
        SELECT COUNT(*) as count
        FROM events_registrations
        WHERE event_id = ${eventId}
          AND status != 'cancelled'
      `
      const currentCount = parseInt(result[0].count as string, 10)

      if (currentCount >= event.capacity) {
        return NextResponse.json(
          { error: 'This event has reached maximum capacity.' },
          { status: 409 }
        )
      }
    }

    // 3. Check for duplicate registration
    const existing = await db`
      SELECT id FROM events_registrations
      WHERE event_id = ${eventId} AND email = ${normalisedEmail}
      LIMIT 1
    `

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'You have already registered for this event.' },
        { status: 409 }
      )
    }

    const ticketRef = generateTicketRef()

    // 4. Insert registration.
    //    Two concurrent requests can both clear the check above, so we also rely
    //    on the unique index from migrations/002_registration_unique.sql and
    //    translate its violation into the same 409 the client already handles.
    try {
      await db`
        INSERT INTO events_registrations
          (event_id, event_title, full_name, email, phone, university, study_level, status, ticket_ref)
        VALUES
          (${eventId}, ${eventTitle}, ${fullName}, ${normalisedEmail}, ${phone}, ${university}, ${studyLevel}, 'confirmed', ${ticketRef})
      `
    } catch (err) {
      // 23505 = unique_violation
      if (typeof err === 'object' && err !== null && 'code' in err && err.code === '23505') {
        return NextResponse.json(
          { error: 'You have already registered for this event.' },
          { status: 409 }
        )
      }
      throw err
    }

    // 5. Generate the ticket and send the confirmation email without delaying
    //    the registration response. A PDF failure must never block registration.
    if (event) {
      const eventDate = new Date(event.date)
      const formattedDate = eventDate.toLocaleDateString('en-NG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      const formattedTime = eventDate.toLocaleTimeString('en-NG', {
        hour: '2-digit',
        minute: '2-digit',
      })
      const ticketData: TicketData = {
        attendeeName: fullName,
        attendeeEmail: normalisedEmail,
        attendeePhone: phone,
        attendeeUniversity: university,
        studyLevel,
        eventTitle,
        eventTheme: event.theme,
        eventDate: formattedDate,
        eventTime: formattedTime,
        eventLocation: event.location,
        eventUniversity: event.university,
        ticketRef,
        issuedAt: new Date().toLocaleDateString('en-NG', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      }

      let ticketPDF: Buffer | null = null
      try {
        ticketPDF = await generateTicketPDF(ticketData)
      } catch (err) {
        console.error('Ticket generation failed:', err)
      }

      sendRegistrationConfirmation({
        to: email,
        recipientName: fullName,
        eventTitle,
        eventDate: formattedDate,
        eventLocation: event.location,
        university,
        ticketRef,
        ticketPDF,
      }).catch((err) => console.error('Failed to send registration email:', err))
    }

    return NextResponse.json(
      { success: true, message: 'Registration confirmed! Check your email for your ticket.' },
      { status: 201 }
    )
  } catch (err) {
    console.error('[/api/register] Error:', err)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
