import type { NextRequest } from 'next/server'

export function isSameOriginLeaderRequest(request: NextRequest): boolean {
  const origin = request.headers.get('origin')
  return origin !== null && origin === request.nextUrl.origin
}
