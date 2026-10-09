import { NextRequest, NextResponse } from 'next/server'
import { NIGERIAN_INSTITUTIONS } from '@/lib/nigerian-institutions'

const MAX_RESULTS = 8

function normalize(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
}

export async function GET(request: NextRequest) {
  const rawQuery = request.nextUrl.searchParams.get('q') ?? ''
  if (rawQuery.length > 100) {
    return NextResponse.json({ error: 'Search query is too long.' }, { status: 400 })
  }
  const query = normalize(rawQuery)
  if (query.length < 3) {
    return NextResponse.json({ institutions: [] }, { headers: { 'Cache-Control': 'public, max-age=60' } })
  }

  const institutions = NIGERIAN_INSTITUTIONS.filter((institution) => {
    const name = normalize(institution.name)
    const abbreviation = normalize(institution.abbreviation ?? '')
    const state = normalize(institution.state)
    return name.includes(query) || abbreviation.includes(query) || state.includes(query)
  }).slice(0, MAX_RESULTS)

  return NextResponse.json({ institutions }, { headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300' } })
}
