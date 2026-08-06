import Link from 'next/link'

const LINKS = [
  { href: '/about', label: 'About' },
  { href: '/programs', label: 'Programs' },
  { href: '/events', label: 'Events' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/get-involved', label: 'Get Involved' },
  { href: '/contact', label: 'Contact' },
] as const

export default function Navbar() {
  return (
    <header className="bg-navy text-white">
      <nav className="container flex items-center justify-between py-4">
        <Link href="/" className="font-display text-gold text-2xl">
          KAMP
        </Link>
        <ul className="hidden gap-6 text-sm md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:text-gold-light">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/donate"
          className="bg-gold text-navy rounded px-4 py-2 text-sm font-semibold"
        >
          Donate
        </Link>
      </nav>
    </header>
  )
}
