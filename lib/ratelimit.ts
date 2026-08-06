// Simple in-memory rate limiter for public API routes.
//
// NOTE: this Map lives in a single serverless function instance. On Vercel each
// instance has its own copy, and instances are recycled, so limits are
// approximate and reset on cold start. For production, swap this for Upstash
// Redis (@upstash/ratelimit + @upstash/redis) to get limits that persist across
// instances.

const requestCounts = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(ip: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now()
  const entry = requestCounts.get(ip)

  if (!entry || entry.resetAt < now) {
    requestCounts.set(ip, { count: 1, resetAt: now + windowMs })
    return true // allowed
  }

  if (entry.count >= limit) return false // blocked

  entry.count++
  return true // allowed
}

// Resolve the client IP from proxy headers. x-forwarded-for may contain a
// comma-separated chain — the first entry is the original client.
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}
