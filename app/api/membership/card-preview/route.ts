import { generateMemberCardPDF } from '@/lib/member-card'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** A synthetic sample card so the design can be reviewed without creating a member. */
export async function GET(request: Request) {
  const card = await generateMemberCardPDF({
    firstName: 'Ada',
    lastName: 'Okafor',
    memberId: 'KAMP/PRO/2026/00042',
    membershipType: 'professional',
    affiliation: 'Software Engineer',
    kampPosition: 'Campus Lead',
    yearJoined: 2026,
  })
  const download = new URL(request.url).searchParams.get('download') === '1'

  return new Response(new Uint8Array(card), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename="KAMP-Membership-Card-Sample.pdf"`,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
