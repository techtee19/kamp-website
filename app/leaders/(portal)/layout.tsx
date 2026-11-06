import { requireLeader } from '@/lib/leader-auth'
import LeaderPortalNav from '@/components/leaders/LeaderPortalNav'

export default async function LeaderPortalLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const leader = await requireLeader()
  return <><LeaderPortalNav name={String(leader.full_name)} campus={String(leader.campus)} /><main className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12">{children}</main></>
}
