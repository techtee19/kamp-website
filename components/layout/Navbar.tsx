'use client'

// Responsive site navigation with compact desktop groups and a mobile drawer.
import { ChevronDown, Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const primaryLinks = [
  { href: '/about', label: 'About' },
  { href: '/programs', label: 'Programs' },
  { href: '/events', label: 'Events' },
]

const exploreLinks = [
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
]

const involvedLinks = [
  { href: '/get-involved', label: 'Join a program' },
  { href: '/membership', label: 'Membership' },
]

type DropdownName = 'explore' | 'involved'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<DropdownName | null>(null)
  const pathname = usePathname()
  const desktopNavRef = useRef<HTMLDivElement>(null)
  const isHome = pathname === '/' || pathname === '/about'

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(`${href}/`))

  const isGroupActive = (links: { href: string; label: string }[]) => links.some((link) => isActive(link.href))

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (desktopNavRef.current && !desktopNavRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenDropdown(null)
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  const groupButtonClass = (active: boolean) =>
    `inline-flex items-center gap-1 py-2 text-sm transition hover:text-brand-gold ${active ? 'text-brand-gold' : isHome ? 'text-brand-white' : 'text-brand-black'}`

  function renderDropdown(name: DropdownName, label: string, links: { href: string; label: string }[]) {
    const expanded = openDropdown === name
    const active = isGroupActive(links)
    const id = `nav-${name}-links`

    return (
      <div className="relative">
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={id}
          onClick={() => setOpenDropdown(expanded ? null : name)}
          className={groupButtonClass(active)}
        >
          {label}<ChevronDown aria-hidden="true" size={14} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
        {expanded && (
          <div id={id} className="absolute left-0 top-full z-50 min-w-44 rounded-xl border border-brand-black/10 bg-brand-white p-2 text-brand-black shadow-xl">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpenDropdown(null)}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={`block rounded-lg px-3 py-2.5 text-sm transition hover:bg-brand-cream hover:text-brand-ink ${isActive(link.href) ? 'font-semibold text-brand-ink' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <header className={`${isHome ? 'absolute inset-x-0 top-0 bg-brand-black/20 text-brand-white' : 'sticky top-0 border-b border-brand-black/10 bg-brand-white/95 text-brand-black backdrop-blur'} z-50`}>
      <nav className="container flex h-24 items-center justify-between gap-6 lg:h-20" aria-label="Main navigation">
        <Link href="/" className="shrink-0" aria-label="KAMP home">
          <Image src={isHome ? '/kamp_logo.svg' : '/kamp_logo_light.png'} alt="KAMP" width={171} height={81} priority className="h-12 w-auto object-contain lg:h-9" />
        </Link>

        <div ref={desktopNavRef} className="hidden items-center gap-5 xl:gap-6 lg:flex">
          {primaryLinks.map((link) => (
            <Link key={link.href} href={link.href} aria-current={isActive(link.href) ? 'page' : undefined} className={`py-2 text-sm transition hover:text-brand-gold ${isActive(link.href) ? 'text-brand-gold' : isHome ? 'text-brand-white' : 'text-brand-black'}`}>
              {link.label}
            </Link>
          ))}
          {renderDropdown('explore', 'Explore', exploreLinks)}
          {renderDropdown('involved', 'Get Involved', involvedLinks)}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/donate" className={`rounded-full px-5 py-2 text-sm transition ${isHome ? 'bg-brand-white text-brand-black hover:bg-brand-white/85' : 'bg-brand-gold text-brand-black hover:bg-brand-gold/85'}`}>
            Donate
          </Link>
        </div>

        <button type="button" className={`grid size-10 place-items-center rounded-full border lg:hidden ${isHome ? 'border-brand-white text-brand-white' : 'border-brand-black text-brand-black'}`} onClick={() => setMenuOpen(true)} aria-label="Open navigation menu" aria-expanded={menuOpen}>
          <Menu size={21} />
        </button>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-brand-black/40 lg:hidden" onClick={() => setMenuOpen(false)}>
          <aside className="ml-auto flex h-[calc(100dvh-3rem)] w-[min(82vw,320px)] flex-col overflow-y-auto bg-brand-black px-5 py-5 text-brand-white shadow-2xl" onClick={(event) => event.stopPropagation()} aria-label="Mobile navigation">
            <div className="flex items-center justify-between">
              <Link href="/" onClick={() => setMenuOpen(false)} aria-label="KAMP home">
                <Image src="/kamp_logo.svg" alt="KAMP" width={171} height={81} className="h-9 w-auto object-contain" />
              </Link>
              <button type="button" className="grid size-10 place-items-center rounded-full border border-brand-white" onClick={() => setMenuOpen(false)} aria-label="Close navigation menu">
                <X size={21} />
              </button>
            </div>

            <div className="mt-9 flex flex-col gap-5">
              {primaryLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} aria-current={isActive(link.href) ? 'page' : undefined} className={`font-display w-fit text-xl leading-none ${isActive(link.href) ? 'border-b-2 border-brand-gold pb-1' : ''}`}>
                  {link.label}
                </Link>
              ))}
              <section className="border-t border-white/15 pt-4">
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-brand-gold">Explore</h2>
                <div className="flex flex-col gap-3">
                  {exploreLinks.map((link) => <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} aria-current={isActive(link.href) ? 'page' : undefined} className="w-fit text-base">{link.label}</Link>)}
                </div>
              </section>
              <section className="border-t border-white/15 pt-4">
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-brand-gold">Get Involved</h2>
                <div className="flex flex-col gap-3">
                  {involvedLinks.map((link) => <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} aria-current={isActive(link.href) ? 'page' : undefined} className="w-fit text-base">{link.label}</Link>)}
                </div>
              </section>
            </div>

            <div className="mt-auto pt-7">
              <Link href="/donate" onClick={() => setMenuOpen(false)} className="inline-flex rounded-full bg-brand-gold px-5 py-2.5 text-sm font-semibold text-brand-black">
                Donate
              </Link>
            </div>
          </aside>
        </div>
      )}
    </header>
  )
}
