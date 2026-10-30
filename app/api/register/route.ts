import { NextRequest, NextResponse } from 'next/server'
import { registrationSchema } from '@/lib/validations'
import { db } from '@/lib/db'
import { client } from '@/sanity/lib/client'
import { EVENT_BY_ID_QUERY } from '@/sanity/lib/queries'
import { sendRegistrationConfirmation } from '@/lib/email'
import { rateLimit, getClientIp } from '@/lib/ratelimit'
import { readJsonRequest, requestBodyErrorResponse } from '@/lib/request-body'
import { generateTicketPDF, generateTicketRef, type TicketData } from '@/lib/ticket'
import {
  createEventRegistrationTable,
  DuplicateRegistrationError,
  EventFullError,
  getEventTableName,
  insertRegistrationAtomic,
} from '@/lib/event-tables'

export const runtime = 'nodejs'
const MAX_REQUEST_BYTES = 8 * 1024

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
    if (!(await rateLimit(`event-register:${getClientIp(req)}`, 5, 60_000))) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // 1. Parse and validate body
    const body = await readJsonRequest(req, MAX_REQUEST_BYTES)
    const parsed = registrationSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { eventId } = parsed.data

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

    let attendee: {
      fullName: string
      email: string
      phone: string
      attendeeType: 'student' | 'professional' | 'non_professional'
      university: string | null
      studyLevel: string | null
      occupation: string | null
      organization: string | null
      memberId?: string
      memberChallengeId?: string
    }

    if ('memberChallengeId' in parsed.data) {
      const [member] = await db`
        SELECT verification.member_id, members.first_name, members.last_name, members.email, members.phone,
          members.membership_type, members.university, members.study_level, members.occupation, members.organization
        FROM event_member_verifications AS verification
        JOIN members ON members.member_id = verification.member_id
        WHERE verification.challenge_id = ${parsed.data.memberChallengeId}::uuid
          AND verification.event_id = ${eventId}
          AND verification.verified_at IS NOT NULL
          AND verification.consumed_at IS NULL
          AND verification.expires_at > NOW()
          AND members.status = 'active'
        LIMIT 1
      `
      if (!member) {
        return NextResponse.json({ error: 'Your member verification expired. Please verify your ID again.' }, { status: 400 })
      }
      attendee = {
        fullName: `${member.first_name} ${member.last_name}`,
        email: String(member.email).toLowerCase(),
        phone: String(member.phone),
        attendeeType: member.membership_type as 'student' | 'professional' | 'non_professional',
        university: member.university ? String(member.university) : null,
        studyLevel: member.study_level ? String(member.study_level) : null,
        occupation: member.occupation ? String(member.occupation) : null,
        organization: member.organization ? String(member.organization) : null,
        memberId: String(member.member_id),
        memberChallengeId: parsed.data.memberChallengeId,
      }
    } else {
      attendee = {
        fullName: parsed.data.fullName,
        email: parsed.data.email.toLowerCase(),
        phone: parsed.data.phone,
        attendeeType: parsed.data.attendeeType,
        university: parsed.data.university ?? null,
        studyLevel: parsed.data.studyLevel ?? null,
        occupation: parsed.data.occupation ?? null,
        organization: parsed.data.organization ?? null,
      }
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
        ...attendee,
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

    // 5. Generate the ticket and await the email API result. On serverless hosts,
    //    fire-and-forget work may be terminated as soon as the response is sent.
    //    Email failure must never undo a registration already saved to the database.
    let emailSent = false
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
        attendeeName: attendee.fullName,
        attendeeEmail: attendee.email,
        attendeePhone: attendee.phone,
        attendeeUniversity: [attendee.university, attendee.occupation, attendee.organization].filter(Boolean).join(' · '),
        studyLevel: attendee.studyLevel ?? (attendee.attendeeType === 'student' ? '' : attendee.attendeeType === 'professional' ? 'Professional' : 'Non-professional'),
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

      try {
        await sendRegistrationConfirmation({
          to: attendee.email,
          recipientName: attendee.fullName,
          eventTitle,
          eventDate: formattedDate,
          eventLocation: event.location,
          university: [attendee.university, attendee.occupation, attendee.organization].filter(Boolean).join(' · ') || 'KAMP member',
          ticketRef,
          ticketPDF,
        })
        emailSent = true
      } catch (err) {
        console.error('Failed to send registration email:', err)
      }
    }

    return NextResponse.json(
      {
        success: true,
        emailSent,
        message: emailSent
          ? 'Registration confirmed! Check your email for your ticket.'
          : 'Registration confirmed, but the confirmation email could not be sent. Please contact KAMP for your ticket.',
      },
      { status: 201 }
    )
  } catch (err) {
    const bodyError = requestBodyErrorResponse(err)
    if (bodyError) return NextResponse.json({ error: bodyError.message }, { status: bodyError.status })
    console.error('[/api/register] Error:', err)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
