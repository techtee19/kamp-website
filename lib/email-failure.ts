export class EmailProviderError extends Error {
  constructor(public code: string, public status: number | null, public retryAfter: string | null = null) {
    super('Email provider rejected the request')
  }
}

export function classifyEmailFailure(error: unknown) {
  if (!(error instanceof EmailProviderError)) return { category: 'temporary', code: 'transport_error', retryAfter: null }
  const { code, status, retryAfter } = error
  if (code === 'daily_quota_exceeded' || code === 'monthly_quota_exceeded') return { category: 'quota', code, retryAfter }
  if (code === 'rate_limit_exceeded' || code === 'concurrent_idempotent_requests') return { category: 'rate_limit', code, retryAfter }
  if (status === 401 || status === 403 || ['invalid_from_address', 'missing_api_key', 'invalid_api_key', 'restricted_api_key'].includes(code)) {
    return { category: 'configuration', code, retryAfter }
  }
  if (code === 'invalid_recipient' || code === 'invalid_recipient_address') return { category: 'invalid_recipient', code, retryAfter }
  if (code === 'suppressed' || code === 'bounced') return { category: code, code, retryAfter }
  if (code === 'invalid_idempotent_request') return { category: 'unknown', code, retryAfter }
  if (status === null || status >= 500) return { category: 'temporary', code, retryAfter }
  if (status >= 400 && status < 500) return { category: 'permanent', code, retryAfter }
  return { category: 'unknown', code, retryAfter }
}

export function retryDelay(category: string, attempt: number, retryAfter: string | null, code: string, now: number, jitter = Math.random()) {
  if (attempt >= 5 || !['quota', 'rate_limit', 'temporary'].includes(category) || code === 'monthly_quota_exceeded') return null
  const hint = retryAfter === null ? 0 : /^\d+$/.test(retryAfter) ? Number(retryAfter) * 1000 : Date.parse(retryAfter) - now
  const backoff = Math.min(30 * 60_000, 60_000 * 2 ** (attempt - 1)) * (1 + 0.25 * jitter)
  return Math.max(Number.isFinite(hint) ? hint : 0, category === 'quota' && !(hint > 0) ? 60 * 60_000 : 0, backoff)
}

export function deliveryStatus(event: string) {
  const states: Record<string, string> = {
    'email.sent': 'accepted', 'email.delivered': 'delivered', 'email.delivery_delayed': 'delayed',
    'email.bounced': 'bounced', 'email.suppressed': 'suppressed', 'email.failed': 'failed',
  }
  return Object.hasOwn(states, event) ? states[event] : null
}
