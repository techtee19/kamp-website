import { z } from 'zod'
import { db } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-session'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const headers = { 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' }
  if (!(await getAdminSession())) return new Response(null, { status: 403, headers })
  const id = z.uuid().safeParse((await context.params).id)
  if (!id.success) return new Response(null, { status: 404, headers })
  const [image] = await db`SELECT filename, content_type, content FROM membership_support_reply_images WHERE id = ${id.data}::uuid`
  if (!image) return new Response(null, { status: 404, headers })
  return new Response(new Uint8Array(image.content), { headers: {
    ...headers, 'Content-Type': String(image.content_type), 'Content-Disposition': `inline; filename="${String(image.filename).replace(/[^a-zA-Z0-9 _.-]/g, '_')}"`,
  } })
}
