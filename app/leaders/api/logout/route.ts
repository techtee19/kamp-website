import { NextRequest, NextResponse } from 'next/server'
import { destroyLeaderSession } from '@/lib/leader-auth'
import { isSameOriginLeaderRequest } from '@/lib/leader-request'

export async function POST(request: NextRequest) {
  if (!isSameOriginLeaderRequest(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  await destroyLeaderSession()
  return NextResponse.json({ success: true })
}
