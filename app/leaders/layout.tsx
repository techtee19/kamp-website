import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Leaders Portal | KAMP',
  robots: { index: false, follow: false },
}

export default function LeadersLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-screen bg-[radial-gradient(ellipse_at_85%_0%,rgba(239,188,43,.12),transparent_28rem),linear-gradient(180deg,#f7f6f2_0%,#f5f4ef_56%,#f1f0eb_100%)] text-brand-black">{children}</div>
}
