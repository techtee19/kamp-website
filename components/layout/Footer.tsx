// Site footer with newsletter signup and primary navigation.
import Image from 'next/image'
import Link from 'next/link'

const links = [
  { href: '/about', label: 'About' },
  { href: '/programs', label: 'Programs' },
  { href: '/events', label: 'Events' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/get-involved', label: 'Get Involved' },
  { href: '/contact', label: 'Contact' },
]

export default function Footer() {
  return (
    <footer className="bg-brand-black text-brand-white">
      <div className="container py-17 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[1.45fr_.65fr_.7fr] lg:items-start">
          <div>
            <h2 className="font-display text-[26px] font-semibold leading-none lg:text-4xl">Stay Updated</h2>
            <p className="mt-3 text-[15px] leading-[20px] text-brand-white/80 lg:text-sm">Get updates on upcoming conferences and campus projects</p>
            {/* The field and its button share one row even on the narrowest phone:
                the button keeps a fixed width and the input takes the rest. */}
            <form className="mt-5 flex max-w-md gap-1 sm:gap-0">
              <label className="sr-only" htmlFor="footer-email">Email address</label>
              <input id="footer-email" type="email" placeholder="Enter your Email Address" className="min-w-0 flex-1 rounded-full bg-brand-white/15 px-5 py-2.5 text-sm text-brand-white outline-none placeholder:text-brand-white/65 focus:ring-2 focus:ring-brand-gold" />
              <button type="submit" className="w-28 shrink-0 rounded-full bg-brand-gold py-2.5 text-sm text-brand-deep sm:-ml-3 sm:w-auto sm:px-5">Subscribe</button>
            </form>
            <p className="mt-3 text-[15px] leading-[20px] text-brand-white/75 lg:text-sm">Get updates on upcoming conferences and campus projects</p>
          </div>

          <nav className="flex flex-col gap-5 text-[15px] lg:gap-2 lg:text-sm" aria-label="Footer navigation">
            {links.map((link) => <Link key={link.href} href={link.href} className="transition hover:text-brand-gold">{link.label}</Link>)}
          </nav>

          <div className="lg:pt-5 lg:text-right">
            <Image src="/kamp_logo.svg" alt="KAMP" width={171} height={81} className="h-auto w-62.5 object-contain lg:w-56" />
          </div>
        </div>
      </div>
    </footer>
  )
}
