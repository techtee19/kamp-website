import { NextRequest, NextResponse } from 'next/server'
import { registrationSchema } from '@/lib/validations'
import { client } from '@/sanity/lib/client'
import { EVENT_BY_ID_QUERY } from '@/sanity/lib/queries'
import { sendRegistrationConfirmation } from '@/lib/email'
import { rateLimit, getClientIp } from '@/lib/ratelimit'
import { generateTicketPDF, generateTicketRef, type TicketData } from '@/lib/ticket'
import {
  createEventRegistrationTable,
  DuplicateRegistrationError,
  EventFullError,
  getEventTableName,
  insertRegistrationAtomic,
} from '@/lib/event-tables'

export const runtime = 'nodejs'

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

    const { eventId, fullName, email, phone, university, studyLevel } = parsed.data
    const normalisedEmail = email.toLowerCase()

    // 2. Check capacity if the event has a limit
    const event = await client.withConfig({ useCdn: false }).fetch<{
      title: string
      slug: { current: string }
      registrationClosed?: boolean
      status: string
      capacity?: number
      date: string
      location: string
      university: string
      theme?: string
    } | null>(EVENT_BY_ID_QUERY, { id: eventId })

    if (!event || !event.slug?.current) {
      return NextResponse.json({ error: 'Event not found.' }, { status: 404 })
    }

    if (event.registrationClosed || event.status === 'past') {
      return NextResponse.json(
        { error: 'Registration for this event is closed.' },
        { status: 409 }
      )
    }

    const eventTitle = event.title
    let tableName = await getEventTableName(eventId)
    if (!tableName) {
      const result = await createEventRegistrationTable(eventId, event.slug.current, eventTitle)
      tableName = result.tableName
    }

    const ticketRef = generateTicketRef()

    // Capacity checks and inserts run under one transaction-level event lock;
    // the database's email constraint handles duplicate submissions.
    try {
      await insertRegistrationAtomic({
        eventId,
        eventTitle,
        fullName,
        email: normalisedEmail,
        phone,
        university,
        studyLevel,
        ticketRef,
        tableName,
        capacity: event.capacity,
      })
    } catch (err) {
      if (err instanceof DuplicateRegistrationError) {
        return NextResponse.json(
          { error: 'You have already registered for this event.' },
          { status: 409 }
        )
      }
      if (err instanceof EventFullError) {
        return NextResponse.json(
          { error: 'This event has reached maximum capacity.' },
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
