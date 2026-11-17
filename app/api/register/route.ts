import { after, NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { freshClient } from '@/sanity/lib/client'
import { EVENT_BY_ID_QUERY } from '@/sanity/lib/queries'
import { rateLimitStatus, getClientIp } from '@/lib/ratelimit'
import { networkLimit } from '@/lib/registration-limits'
import { readJsonRequest, requestBodyErrorResponse } from '@/lib/request-body'
import { generateTicketRef, type TicketData } from '@/lib/ticket'
import { tryRegistrationEmail } from '@/lib/registration-email'
import {
  createEventRegistrationTable,
  DuplicateRegistrationError,
  EventFullError,
  getEventTableName,
  insertRegistrationAtomic,
} from '@/lib/event-tables'

export const runtime = 'nodejs'
export const maxDuration = 30

const schema = z.object({ eventId: z.string().min(1).max(128), memberChallengeId: z.uuid() })

export async function POST(request: NextRequest) {
  const started = Date.now()
  let phase = 'rate_limit'
  try {
    const limit = await rateLimitStatus(
      `event-register:${getClientIp(request)}`,
      networkLimit('EVENT_REGISTRATION_IP_LIMIT', 120),
      60_000
    )
    if (!limit.allowed)
      return NextResponse.json(
        { error: 'Too many requests from this network. Please try again shortly.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
      )
    phase = 'validation'
    const parsed = schema.safeParse(await readJsonRequest(request, 2048))
    if (!parsed.success)
      return NextResponse.json(
        { error: 'Verify your KAMP member ID before registering.' },
        { status: 400 }
      )
    const { eventId, memberChallengeId } = parsed.data

    phase = 'event_lookup'
    if (!freshClient)
      return NextResponse.json(
        { error: 'Event registration is temporarily unavailable.' },
        { status: 503 }
      )
    const lookupStarted = Date.now()
    const event = await freshClient.fetch<{
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
    const eventMs = Date.now() - lookupStarted
    if (!event?.slug?.current)
      return NextResponse.json({ error: 'Event not found.' }, { status: 404 })
    if (event.registrationClosed || event.status === 'past') {
      return NextResponse.json(
        { error: 'Registration for this event is closed.' },
        { status: 409 }
      )
    }

    phase = 'database'
    const databaseStarted = Date.now()
    const [member] = await db`
      SELECT verification.member_id, members.first_name, members.last_name, members.email, members.phone,
        members.membership_type, members.university, members.study_level, members.occupation, members.organization
      FROM event_member_verifications AS verification JOIN members USING (member_id)
      WHERE verification.challenge_id = ${memberChallengeId}::uuid AND verification.event_id = ${eventId}
        AND verification.verified_at IS NOT NULL AND verification.consumed_at IS NULL
        AND NOT verification.pending_delivery AND verification.expires_at > NOW() AND members.status = 'active'
    `
    if (!member)
      return NextResponse.json(
        { error: 'Your member verification expired. Please verify your ID again.' },
        { status: 400 }
      )
    const attendee = {
      fullName: `${member.first_name} ${member.last_name}`,
      email: String(member.email),
      phone: String(member.phone),
      attendeeType: member.membership_type as 'student' | 'professional' | 'non_professional',
      university: member.university ? String(member.university) : null,
      studyLevel: member.study_level ? String(member.study_level) : null,
      occupation: member.occupation ? String(member.occupation) : null,
      organization: member.organization ? String(member.organization) : null,
      memberId: String(member.member_id),
      memberChallengeId,
    }
    const tableName =
      (await getEventTableName(eventId)) ??
      (await createEventRegistrationTable(eventId, event.slug.current, event.title)).tableName
    const when = new Date(event.date)
    const ticketRef = generateTicketRef()
    const dateOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Africa/Lagos',
    } as const
    const ticket: TicketData = {
      attendeeName: attendee.fullName,
      attendeeEmail: '',
      attendeePhone: '',
      attendeeUniversity: [attendee.university, attendee.occupation, attendee.organization]
        .filter(Boolean)
        .join(' · '),
      studyLevel:
        attendee.studyLevel ??
        (attendee.attendeeType === 'professional'
          ? 'Professional'
          : attendee.attendeeType === 'student'
            ? ''
            : 'Non-professional'),
      eventTitle: event.title,
      eventTheme: event.theme,
      eventDate: when.toLocaleDateString('en-NG', { ...dateOptions, weekday: 'long' }),
      eventTime: when.toLocaleTimeString('en-NG', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Africa/Lagos',
      }),
      eventLocation: event.location,
      eventUniversity: event.university,
      ticketRef,
      issuedAt: new Date().toLocaleDateString('en-NG', dateOptions),
    }
    const jobId = await insertRegistrationAtomic({
      ...attendee,
      eventId,
      eventTitle: event.title,
      tableName,
      ticketRef,
      capacity: event.capacity,
      ticketPayload: ticket,
    })
    if (jobId) after(() => tryRegistrationEmail(jobId))
    return NextResponse.json(
      { success: true, emailPending: true, ticketRef },
      {
        status: 201,
        headers: {
          'Cache-Control': 'no-store',
          'Server-Timing': `event;dur=${eventMs}, db;dur=${Date.now() - databaseStarted}, total;dur=${Date.now() - started}`,
        },
      }
    )
  } catch (error) {
    const bodyError = requestBodyErrorResponse(error)
    if (bodyError)
      return NextResponse.json({ error: bodyError.message }, { status: bodyError.status })
    if (error instanceof DuplicateRegistrationError)
      return NextResponse.json(
        { error: 'You have already registered for this event.' },
        { status: 409 }
      )
    if (error instanceof EventFullError)
      return NextResponse.json(
        { error: 'This event has reached maximum capacity.' },
        { status: 409 }
      )
    if (
      error instanceof Error &&
      error.message === 'Member verification expired. Please verify again.'
    ) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    console.error('[event-registration] Failed', { phase, durationMs: Date.now() - started })
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
