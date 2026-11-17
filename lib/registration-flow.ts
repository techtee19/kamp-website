export function eventSlug(value: string | null) {
  return value && /^[a-z0-9][a-z0-9_-]{0,127}$/i.test(value) ? value : null
}

export function countdownSeconds(retryAt: number, now: number) {
  return Math.max(0, Math.ceil((retryAt - now) / 1000))
}
