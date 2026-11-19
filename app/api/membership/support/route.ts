import { z } from 'zod'
import { db } from '@/lib/db'
import { getClientIp, rateLimit } from '@/lib/ratelimit'
import { readJsonRequest, requestBodyErrorResponse } from '@/lib/request-body'
import { normalizeWhatsAppNumber } from '@/lib/whatsapp-number'

const schema = z.object({
  email: z.email().max(254),
  memberId: z.string().trim().max(64).optional(),
  issueType: z.enum(['membership', 'whatsapp']).default('membership'),
  whatsappNumber: z.string().trim().max(32).optional(),
  message: z.string().trim().max(1000).default(''),
}).superRefine((input, context) => {
  if (input.issueType === 'membership' && input.message.length < 10) {
    context.addIssue({ code: 'custom', path: ['message'], message: 'Describe the issue in at least 10 characters.' })
  }
  if (input.issueType === 'whatsapp' && !normalizeWhatsAppNumber(input.whatsappNumber ?? '')) {
    context.addIssue({ code: 'custom', path: ['whatsappNumber'], message: 'Enter your WhatsApp number, using a Nigerian mobile number or an international country code.' })
  }
})

export async function POST(request: Request) {
  try {
    if (!(await rateLimit(`membership-support:ip:${getClientIp(request)}`, 30, 60 * 60_000))) {
      return Response.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }
    const parsed = schema.safeParse(await readJsonRequest(request, 8192))
    if (!parsed.success) return Response.json({ error: parsed.error.issues[0]?.message ?? 'Check the support fields.' }, { status: 400 })
    const email = parsed.data.email.toLowerCase()
    if (!(await rateLimit(`membership-support:email:${email}`, 3, 60 * 60_000))) {
      return Response.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }
    await db`
      INSERT INTO membership_support_requests (reply_email, member_id_hint, message, issue_type, whatsapp_number)
      VALUES (${email}, ${parsed.data.memberId || null},
        ${parsed.data.message || 'Unable to join the WhatsApp community. Please add me manually.'},
        ${parsed.data.issueType},
        ${parsed.data.issueType === 'whatsapp' ? normalizeWhatsAppNumber(parsed.data.whatsappNumber!) : null})
    `
    return Response.json({ message: parsed.data.issueType === 'whatsapp'
      ? 'We received your request. The KAMP team will use your WhatsApp number to help you join the community.'
      : 'We received your request. If the information matches our records, the KAMP team will follow up.' },
      { status: 201, headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    const bodyError = requestBodyErrorResponse(error)
    return Response.json({ error: bodyError?.message ?? 'Could not send your request. Please try again.' }, { status: bodyError?.status ?? 503 })
  }
}
