import { NextRequest, NextResponse } from 'next/server'

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname === '/leaders' || pathname.startsWith('/leaders/')) {
    const publicPaths = new Set([
      '/leaders/login',
      '/leaders/verify',
      '/leaders/api/request-link',
      '/leaders/api/verify',
    ])
    if (publicPaths.has(pathname)) return NextResponse.next()
    if (!req.cookies.get('kamp_leader_session')?.value) {
      if (pathname.startsWith('/leaders/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/leaders/login', req.url))
    }
  }

  if (pathname === '/admin') {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  // API handlers perform signed-session checks themselves and need JSON 401s,
  // not browser redirects.
  if (pathname.startsWith('/admin/api/') || pathname === '/admin/login') {
    return NextResponse.next()
  }

  if (!req.cookies.get('kamp_admin_session')?.value) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  // This cookie-presence check only avoids unnecessary page renders. The
  // protected layout and every private API verify the HMAC and expiration.
  return NextResponse.next()
}

export const config = { matcher: ['/admin', '/admin/:path*', '/leaders', '/leaders/:path*'] }
