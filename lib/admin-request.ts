import type { NextRequest } from 'next/server'

/** Require browser mutations to originate from this app, mitigating CSRF. */
export function isSameOriginAdminRequest(request: NextRequest): boolean {
  const origin = request.headers.get('origin')
  return origin !== null && origin === request.nextUrl.origin
}
