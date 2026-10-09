import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import DeleteMemberButton from '@/components/admin/DeleteMemberButton'
import ResendCardButton from '@/components/admin/ResendCardButton'

export const dynamic = 'force-dynamic'

export default async function MemberProfilePage({ params }: { params: Promise<{ memberId: string }> }) {
  const { memberId } = await params
  if (!/^KAMP-MBR-\d{4}-\d{5}$/.test(memberId)) notFound()
  const [member] = await db`
    SELECT member_id, first_name, last_name, email, phone, university,
      gender, state_of_origin, study_level, why_join, status, year_joined, joined_at
    FROM members WHERE member_id = ${memberId} LIMIT 1
  `
  if (!member) notFound()

  const fields = [
    ['Full name', `${member.first_name} ${member.last_name}`],
    ['Email', member.email], ['Phone', member.phone], ['Institution', member.university],
    ['Level of study', member.study_level], ['State of origin', member.state_of_origin],
    ['Gender', member.gender], ['Year joined', member.year_joined],
    ['Date joined', new Date(member.joined_at as string).toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })],
    ['Member ID', member.member_id],
  ] as const

  return <div className="mx-auto max-w-3xl p-5 sm:p-8">
    <Link href="/admin/members" className="mb-6 inline-block text-sm text-brand-grey transition hover:text-brand-black">← Back to members</Link>
    <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div><h1 className="font-display text-2xl font-bold text-brand-black">{member.first_name as string} {member.last_name as string}</h1><p className="mt-1 font-mono text-sm font-semibold text-brand-gold">{member.member_id as string}</p></div>
      <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${member.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{member.status as string}</span>
    </header>
    <section className="mb-6 overflow-hidden rounded-xl border border-brand-card bg-white">
      <div className="border-b border-brand-card bg-brand-cream px-6 py-4"><h2 className="text-sm font-semibold text-brand-black">Member details</h2></div>
      <dl className="grid grid-cols-1 sm:grid-cols-2">{fields.map(([label, value], index) => <div key={label} className={`border-b border-brand-card px-6 py-4 ${index % 2 ? 'bg-brand-cream/40' : ''}`}><dt className="mb-1 text-xs uppercase tracking-widest text-brand-grey">{label}</dt><dd className="break-words text-sm font-medium text-brand-black">{String(value ?? '—')}</dd></div>)}</dl>
      {member.why_join && <div className="border-t border-brand-card px-6 py-4"><h3 className="mb-2 text-xs uppercase tracking-widest text-brand-grey">Why they joined</h3><p className="whitespace-pre-wrap text-sm leading-relaxed text-brand-black">{member.why_join as string}</p></div>}
    </section>
    <div className="flex flex-wrap items-start gap-3"><ResendCardButton memberId={member.member_id as string} /><DeleteMemberButton memberId={member.member_id as string} memberName={`${member.first_name as string} ${member.last_name as string}`} /></div>
  </div>
}
