// KAMP's event gallery with the Emerge 2026 photo mosaic.
import Image from 'next/image'
import GalleryLightbox from '@/components/sections/GalleryLightbox'

const galleryImages = [
  { src: 'DSC05916.jpg', alt: 'KAMP guests at Emerge 2026', className: 'col-span-2 row-span-2 md:col-span-2 md:row-span-2' },
  { src: 'DSC06029.jpg', alt: 'Emerge 2026 attendees', className: 'col-span-2 row-span-2 md:col-span-2 md:row-span-2' },
  { src: 'DSC06037.jpg', alt: 'KAMP event guests', className: 'col-span-2 row-span-2 md:col-span-2 md:row-span-2' },
  { src: 'DSC06240.jpg', alt: 'KAMP speaker at Emerge', className: 'col-span-2 row-span-2 md:col-span-2 md:row-span-2' },
  { src: 'DSC06469.jpg', alt: 'KAMP media team', className: 'col-span-4 row-span-2 md:col-span-4 md:row-span-2' },
  { src: 'DSC05537.jpg', alt: 'KAMP participants', className: 'col-span-2 row-span-2 md:col-span-2 md:row-span-2' },
  { src: 'DSC05684.jpg', alt: 'KAMP volunteer team', className: 'col-span-2 row-span-2 md:col-span-3 md:row-span-2' },
  { src: 'DSC05984.jpg', alt: 'Emerge 2026 embrace', className: 'col-span-2 row-span-2 md:col-span-5 md:row-span-2' },
  { src: 'DSC06092.jpg', alt: 'KAMP attendees walking', className: 'col-span-2 row-span-2 md:col-span-2 md:row-span-2' },
  { src: 'DSC05771.jpg', alt: 'KAMP mentor speaking', className: 'col-span-2 row-span-3 md:col-span-2 md:row-span-3' },
  { src: 'DSC06118.jpg', alt: 'KAMP community gathering', className: 'col-span-4 row-span-3 md:col-span-8 md:row-span-3' },
  { src: 'DSC05783.jpg', alt: 'KAMP audience', className: 'col-span-2 row-span-3 md:col-span-2 md:row-span-3' },
  { src: 'DSC06155.jpg', alt: 'KAMP Emerge group photo', className: 'col-span-2 row-span-2 md:col-span-5 md:row-span-2' },
  { src: 'DSC05487.jpg', alt: 'KAMP participant', className: 'col-span-2 row-span-2 md:col-span-3 md:row-span-2' },
]

const allGalleryImages = ['DSC05487.jpg', 'DSC05537.jpg', 'DSC05642.jpg', 'DSC05647.jpg', 'DSC05684.jpg', 'DSC05709.jpg', 'DSC05771.jpg', 'DSC05783.jpg', 'DSC05786.jpg', 'DSC05794.jpg', 'DSC05803.jpg', 'DSC05804.jpg', 'DSC05888.jpg', 'DSC05916.jpg', 'DSC05919.jpg', 'DSC05967.jpg', 'DSC05984.jpg', 'DSC05992.jpg', 'DSC05995.jpg', 'DSC05997.jpg', 'DSC06018.jpg', 'DSC06023.jpg', 'DSC06027.jpg', 'DSC06029.jpg', 'DSC06031.jpg', 'DSC06037.jpg', 'DSC06045.jpg', 'DSC06092 (1).jpg', 'DSC06092.jpg', 'DSC06118.jpg', 'DSC06125.jpg', 'DSC06155.jpg', 'DSC06165.jpg', 'DSC06175.jpg', 'DSC06192.jpg', 'DSC06217.jpg', 'DSC06240.jpg', 'DSC06284 (1).jpg', 'DSC06309 (1).jpg', 'DSC06469.jpg', 'DSC06476.jpg', 'DSC06568 (1).jpg', 'DSC06607.jpg', 'DSC06634.jpg', 'DSC06644 (1).jpg', 'DSC07802.jpg', 'DSC07808.jpg', 'DSC07816.jpg', 'DSC07824.jpg', 'DSC08059.jpg', 'DSC08080.jpg', 'DSC08164.jpg', 'DSC08172.jpg', 'DSC08353.jpg', 'DSC08362.jpg', 'DSC08367.jpg', 'DSC08404.jpg', 'DSC08429.jpg', 'DSC08453.jpg', 'DSC08479.jpg', 'DSC08589.jpg', 'DSC08673.jpg', 'DSC08697.jpg', 'DSC08719.jpg', 'DSC08764.jpg', 'DSC08779.jpg', 'DSC08785.jpg', 'DSC08794.jpg']

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
        <div className="container max-w-[1200px]">
          <div className="flex items-center justify-between gap-6">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Emerge 2026</h2>
            <div className="hidden items-center gap-7 md:flex" aria-hidden="true">
              <Image src="/images/gallery/left-arrow.png" alt="" width={38} height={20} className="h-5 w-auto" />
              <Image src="/images/gallery/right-arrow.png" alt="" width={38} height={20} className="h-5 w-auto" />
            </div>
          </div>

          <div className="mt-8 grid auto-rows-[72px] grid-cols-4 gap-3 sm:auto-rows-[88px] md:mt-10 md:auto-rows-[80px] md:grid-cols-12 md:gap-4 lg:auto-rows-[96px]">
            {galleryImages.map((image) => (
              <figure key={image.src} className={`relative overflow-hidden rounded-2xl bg-brand-card ${image.className}`}>
                <Image src={`/images/gallery/kamp-gallery/${image.src}`} alt={image.alt} fill sizes="(min-width: 768px) 20vw, 48vw" className="object-cover transition duration-500 hover:scale-105" />
              </figure>
            ))}
            <GalleryLightbox images={allGalleryImages} hiddenCount={allGalleryImages.length - galleryImages.length} />
          </div>
        </div>
      </section>
    </div>
  )
}
