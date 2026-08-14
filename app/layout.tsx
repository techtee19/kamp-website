import type { Metadata } from 'next'
import { Urbanist } from 'next/font/google'
import './globals.css'

const urbanist = Urbanist({
  subsets: ['latin'],
  variable: '--font-urbanist',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://wearekamp.org'),
  title: {
    default: 'KAMP — Raising Transformative Leaders',
    template: '%s | KAMP',
  },
  description:
    'Kolade Adepoju Mentoring Program empowers Nigerian university students to become transformative leaders who positively influence their communities.',
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://wearekamp.org',
    siteName: 'KAMP',
  },
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${urbanist.variable} h-full`}>
      <body className="font-body text-charcoal flex min-h-full flex-col bg-white antialiased">
        {children}
      </body>
    </html>
  )
}
