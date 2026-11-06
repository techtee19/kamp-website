import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-session'
import { db } from '@/lib/db'
import { csvFile } from '@/lib/csv-export'
export const dynamic = 'force-dynamic'
export async function GET() {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const rows = await db`SELECT r.id,r.report_type,r.title,r.report_date,r.events_held,r.attendance,r.summary,r.achievements,r.challenges,r.next_steps,r.links,r.created_at,l.full_name,l.email,l.campus FROM leader_reports r JOIN leaders l ON l.id=r.leader_id ORDER BY r.created_at DESC`
  return csvFile(rows, ['id','report_type','title','report_date','events_held','attendance','summary','achievements','challenges','next_steps','links','created_at','full_name','email','campus'].map((key)=>({key,label:key.replaceAll('_',' ')})), 'kamp-leader-reports.csv')
}
