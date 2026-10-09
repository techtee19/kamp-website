import { createHmac } from 'node:crypto'
import { db } from '@/lib/db'

let lastCleanupAt = 0

/** Shared PostgreSQL-backed fixed-window limit for all deployed instances. */
export async function rateLimit(key: string, limit = 5, windowMs = 60_000): Promise<boolean> {
  if (!Number.isInteger(limit) || limit < 1 || !Number.isInteger(windowMs) || windowMs < 1) {
    throw new Error('Invalid rate limit configuration')
  }

  const secret = process.env.DATABASE_URL
  if (!secret) throw new Error('DATABASE_URL is required for shared rate limiting')
  const keyHash = createHmac('sha256', secret).update(key).digest('hex')

  // Sweep a bounded number of old buckets at most once per warm instance/minute.
  // The rate-limit key is an HMAC, so raw client IP addresses are not stored.
  const now = Date.now()
  const shouldCleanup = now - lastCleanupAt >= 60_000
  if (shouldCleanup) {
    await db`
      WITH expired AS (
        SELECT key_hash FROM security_rate_limits
        WHERE updated_at < NOW() - INTERVAL '1 day'
        ORDER BY updated_at
        LIMIT 100
      )
      DELETE FROM security_rate_limits AS limits
      USING expired
      WHERE limits.key_hash = expired.key_hash
    `
  }

  const rows = await db<{ request_count: number }[]>`
    INSERT INTO security_rate_limits (key_hash, window_started_at, window_ms, request_count, updated_at)
    VALUES (${keyHash}, NOW(), ${windowMs}, 1, NOW())
    ON CONFLICT (key_hash) DO UPDATE SET
      request_count = CASE
        WHEN security_rate_limits.window_ms <> EXCLUDED.window_ms
          OR security_rate_limits.window_started_at + (security_rate_limits.window_ms * INTERVAL '1 millisecond') <= NOW()
          THEN 1
        ELSE LEAST(security_rate_limits.request_count + 1, ${limit + 1})
      END,
      window_started_at = CASE
        WHEN security_rate_limits.window_ms <> EXCLUDED.window_ms
          OR security_rate_limits.window_started_at + (security_rate_limits.window_ms * INTERVAL '1 millisecond') <= NOW()
          THEN NOW()
        ELSE security_rate_limits.window_started_at
      END,
      window_ms = EXCLUDED.window_ms,
      updated_at = NOW()
    RETURNING request_count
  `

  if (shouldCleanup) lastCleanupAt = now
  return Number(rows[0]?.request_count ?? limit + 1) <= limit
}

// The deployment proxy must overwrite x-forwarded-for with the originating
// client IP. If hosting changes, configure its trusted proxy header here rather
// than accepting an arbitrary client-supplied address.
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim().slice(0, 128) || 'unknown'
  return req.headers.get('x-real-ip')?.trim().slice(0, 128) || 'unknown'
}
