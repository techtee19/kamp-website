import { redirect } from 'next/navigation'
import { getLeader } from '@/lib/leader-auth'

export default async function LeadersIndexPage() {
  redirect(await getLeader() ? '/leaders/dashboard' : '/leaders/login')
}
