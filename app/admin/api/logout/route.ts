import { NextResponse } from 'next/server'
import { destroyAdminSession, getAdminSession } from '@/lib/admin-session'

export async function POST() {
  if (await getAdminSession()) await destroyAdminSession()
  return new NextResponse(null, { status: 204, headers: { 'Cache-Control': 'no-store' } })
}
