import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'KAMP Studio',
}

// Children render bare: the Studio lives outside the (site) group, so the
// marketing Navbar and Footer never wrap it.
export default function StudioLayout({ children }: LayoutProps<'/studio/[[...tool]]'>) {
  return children
}
