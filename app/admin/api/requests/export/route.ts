import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-session'
import { db } from '@/lib/db'
import { csvFile } from '@/lib/csv-export'
export const dynamic = 'force-dynamic'
export async function GET() {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const rows = await db`SELECT r.id,r.request_type,r.title,r.description,r.event_name,r.event_date,r.amount_requested,r.budget_breakdown,r.needed_by,r.links,r.status,r.review_note,r.created_at,r.updated_at,l.full_name,l.email,l.campus FROM leader_requests r JOIN leaders l ON l.id=r.leader_id ORDER BY r.updated_at DESC`
  return csvFile(rows, ['id','request_type','title','description','event_name','event_date','amount_requested','budget_breakdown','needed_by','links','status','review_note','created_at','updated_at','full_name','email','campus'].map((key)=>({key,label:key.replaceAll('_',' ')})), 'kamp-leader-requests.csv')
}
