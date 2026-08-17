// KAMP's event gallery with the Emerge 2026 photo mosaic.
import Image from 'next/image'
import GalleryAlbum from '@/components/sections/GalleryAlbum'

// The curated opening spread, in slot order, so the mosaic reads exactly as
// designed before anyone touches an arrow.
const featuredPhotos = [
  { src: 'DSC05916.jpg', alt: 'KAMP guests at Emerge 2026' },
  { src: 'DSC06029.jpg', alt: 'Emerge 2026 attendees' },
  { src: 'DSC06037.jpg', alt: 'KAMP event guests' },
  { src: 'DSC06240.jpg', alt: 'KAMP speaker at Emerge' },
  { src: 'DSC06469.jpg', alt: 'KAMP media team' },
  { src: 'DSC05537.jpg', alt: 'KAMP participants' },
  { src: 'DSC05684.jpg', alt: 'KAMP volunteer team' },
  { src: 'DSC05984.jpg', alt: 'Emerge 2026 embrace' },
  { src: 'DSC06092.jpg', alt: 'KAMP attendees walking' },
  { src: 'DSC05771.jpg', alt: 'KAMP mentor speaking' },
  { src: 'DSC06118.jpg', alt: 'KAMP community gathering' },
  { src: 'DSC05783.jpg', alt: 'KAMP audience' },
  { src: 'DSC06155.jpg', alt: 'KAMP Emerge group photo' },
  { src: 'DSC05487.jpg', alt: 'KAMP participant' },
]

const albumFilenames = ['DSC05487.jpg', 'DSC05537.jpg', 'DSC05642.jpg', 'DSC05647.jpg', 'DSC05684.jpg', 'DSC05709.jpg', 'DSC05771.jpg', 'DSC05783.jpg', 'DSC05786.jpg', 'DSC05794.jpg', 'DSC05803.jpg', 'DSC05804.jpg', 'DSC05888.jpg', 'DSC05916.jpg', 'DSC05919.jpg', 'DSC05967.jpg', 'DSC05984.jpg', 'DSC05992.jpg', 'DSC05995.jpg', 'DSC05997.jpg', 'DSC06018.jpg', 'DSC06023.jpg', 'DSC06027.jpg', 'DSC06029.jpg', 'DSC06031.jpg', 'DSC06037.jpg', 'DSC06045.jpg', 'DSC06092 (1).jpg', 'DSC06092.jpg', 'DSC06118.jpg', 'DSC06125.jpg', 'DSC06155.jpg', 'DSC06165.jpg', 'DSC06175.jpg', 'DSC06192.jpg', 'DSC06217.jpg', 'DSC06240.jpg', 'DSC06284 (1).jpg', 'DSC06309 (1).jpg', 'DSC06469.jpg', 'DSC06476.jpg', 'DSC06568 (1).jpg', 'DSC06607.jpg', 'DSC06634.jpg', 'DSC06644 (1).jpg', 'DSC07802.jpg', 'DSC07808.jpg', 'DSC07816.jpg', 'DSC07824.jpg', 'DSC08059.jpg', 'DSC08080.jpg', 'DSC08164.jpg', 'DSC08172.jpg', 'DSC08353.jpg', 'DSC08362.jpg', 'DSC08367.jpg', 'DSC08404.jpg', 'DSC08429.jpg', 'DSC08453.jpg', 'DSC08479.jpg', 'DSC08589.jpg', 'DSC08673.jpg', 'DSC08697.jpg', 'DSC08719.jpg', 'DSC08764.jpg', 'DSC08779.jpg', 'DSC08785.jpg', 'DSC08794.jpg']

const featuredSrcs = new Set(featuredPhotos.map((photo) => photo.src))

// Featured spread first, then the rest of the album behind the arrows.
const galleryPhotos = [
  ...featuredPhotos,
  ...albumFilenames
    .filter((src) => !featuredSrcs.has(src))
    .map((src) => ({ src, alt: 'KAMP Emerge 2026 event moment' })),
]

export default function GalleryPage() {
  return (
    <div className="overflow-hidden bg-brand-white text-brand-ink">
      <section className="container flex min-h-56 max-w-[1400px] items-end pb-8 pt-28 md:min-h-72 md:pb-10 md:pt-32">
        <h1 className="font-display text-5xl font-semibold tracking-tight text-brand-black sm:text-6xl md:text-7xl">Our Gallery <Image src="/images/yellow-star.png" alt="" width={80} height={80} className="ml-3 inline-block size-14 align-middle sm:size-20 md:ml-5 md:size-24" /></h1>
      </section>

      <section className="relative h-64 overflow-hidden bg-brand-black sm:h-80 md:h-[360px]">
        <Image src="/images/gallery/kamp-gallery/DSC05783.jpg" alt="KAMP event audience" fill priority sizes="100vw" className="object-cover object-center grayscale" />
        <div className="absolute inset-0 bg-brand-black/65" />
      </section>

      <section className="py-16 md:py-20 xl:py-24">
        <GalleryAlbum title="Emerge 2026" photos={galleryPhotos} />
      </section>
    </div>
  )
}
