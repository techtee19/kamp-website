import { generateTicketPDF, type TicketData } from '@/lib/ticket'
import { PREVIEW_TICKET_REF } from '@/lib/ticket-preview'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const sample: TicketData = {
    attendeeName: 'Amina Bello',
    attendeeEmail: 'amina@example.com',
    attendeePhone: '+234 800 000 0000',
    attendeeUniversity: 'University of Lagos',
    studyLevel: '400L',
    eventTitle: 'KAMP Event Preview',
    eventTheme: 'Sample event details',
    eventDate: 'Saturday, 28 November 2026',
    eventTime: '10:00 AM',
    eventLocation: 'Main Auditorium',
    eventUniversity: 'University of Lagos',
    ticketRef: PREVIEW_TICKET_REF,
    issuedAt: 'Sample preview',
  }

  const pdf = await generateTicketPDF(sample)
  return new Response(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="kamp-ticket-preview.pdf"',
      'Cache-Control': 'no-store',
    },
  })
}
