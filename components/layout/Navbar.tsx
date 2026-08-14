'use client'

// Responsive site navigation with a full-screen mobile menu.
import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const links = [
  { href: '/about', label: 'About' },
  { href: '/programs', label: 'Programs' },
  { href: '/events', label: 'Events' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/get-involved', label: 'Get Involved' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'

  return (
    <header className={`${isHome ? 'absolute inset-x-0 top-0 bg-brand-black/20 text-brand-white' : 'sticky top-0 border-b border-brand-black/10 bg-brand-white/95 text-brand-black backdrop-blur'} z-50`}>
      <nav className="container flex h-16 items-center justify-between gap-6 lg:h-20" aria-label="Main navigation">
        <Link href="/" className="shrink-0" aria-label="KAMP home">
          <Image src="/kamp_logo.svg" alt="KAMP" width={171} height={81} priority className="h-9 w-auto object-contain" />
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={`border-b-2 py-1 text-sm transition hover:border-brand-gold ${pathname === link.href ? 'border-brand-gold' : 'border-transparent'} ${isHome ? 'text-brand-white' : 'text-brand-black'}`}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/get-involved" className={`rounded-full px-5 py-2 text-sm transition ${isHome ? 'text-brand-white' : 'border border-brand-black text-brand-black hover:bg-brand-card'}`}>
            Join a program
          </Link>
          <Link href="/donate" className={`rounded-full px-5 py-2 text-sm transition ${isHome ? 'bg-brand-white text-brand-black hover:bg-brand-white/85' : 'bg-brand-gold text-brand-black hover:bg-brand-gold/85'}`}>
            Donate
          </Link>
        </div>

        <button type="button" className={`grid size-10 place-items-center rounded-full border lg:hidden ${isHome ? 'border-brand-white text-brand-white' : 'border-brand-black text-brand-black'}`} onClick={() => setMenuOpen(true)} aria-label="Open navigation menu">
          <Menu size={21} />
        </button>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-50 flex min-h-screen flex-col bg-brand-black px-6 py-6 text-brand-white lg:hidden">
          <div className="flex items-center justify-between">
            <Image src="/kamp_logo.svg" alt="KAMP" width={171} height={81} className="h-9 w-auto object-contain" />
            <button type="button" className="grid size-10 place-items-center rounded-full border border-brand-white" onClick={() => setMenuOpen(false)} aria-label="Close navigation menu">
              <X size={21} />
            </button>
          </div>
          <div className="mt-auto flex flex-col gap-6 pb-12">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="font-display text-4xl">
                {link.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/get-involved" onClick={() => setMenuOpen(false)} className="rounded-full border border-brand-white px-5 py-2 text-sm">
                Join a program
              </Link>
              <Link href="/donate" onClick={() => setMenuOpen(false)} className="rounded-full bg-brand-gold px-5 py-2 text-sm text-brand-black">
                Donate
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
