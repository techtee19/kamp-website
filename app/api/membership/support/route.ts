import { z } from 'zod'
import { db } from '@/lib/db'
import { getClientIp, rateLimit } from '@/lib/ratelimit'
import { readJsonRequest, requestBodyErrorResponse } from '@/lib/request-body'

const schema = z.object({
  email: z.email().max(254),
  memberId: z.string().trim().max(64).optional(),
  message: z.string().trim().min(10).max(1000),
})

export async function POST(request: Request) {
  try {
    if (!(await rateLimit(`membership-support:ip:${getClientIp(request)}`, 30, 60 * 60_000))) {
      return Response.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }
    const parsed = schema.safeParse(await readJsonRequest(request, 8192))
    if (!parsed.success) return Response.json({ error: 'Enter a reply email and a brief description.' }, { status: 400 })
    const email = parsed.data.email.toLowerCase()
    if (!(await rateLimit(`membership-support:email:${email}`, 3, 60 * 60_000))) {
      return Response.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }
    await db`
      INSERT INTO membership_support_requests (reply_email, member_id_hint, message)
      VALUES (${email}, ${parsed.data.memberId || null}, ${parsed.data.message})
    `
    return Response.json({ message: 'We received your request. If the information matches our records, the KAMP team will follow up.' },
      { status: 201, headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    const bodyError = requestBodyErrorResponse(error)
    return Response.json({ error: bodyError?.message ?? 'Could not send your request. Please try again.' }, { status: bodyError?.status ?? 503 })
  }
}
