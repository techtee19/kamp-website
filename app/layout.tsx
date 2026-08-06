import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
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
    <html lang="en" className={`${playfair.variable} ${inter.variable} h-full`}>
      <body className="font-body text-charcoal flex min-h-full flex-col bg-white antialiased">
        {children}
      </body>
    </html>
  )
}
