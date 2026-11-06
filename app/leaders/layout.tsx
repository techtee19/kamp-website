import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Leaders Portal | KAMP',
  robots: { index: false, follow: false },
}

export default function LeadersLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-screen bg-brand-cream text-brand-black">{children}</div>
}
