// Seed content for the photo album that predates the CMS. Sanity is the source of
// truth for the Gallery page now — editing this file no longer changes the site. It is
// kept as the input to `npm run migrate:gallery`, which is idempotent, so a fresh
// dataset can be repopulated from here.
//
// The files stay in public/images/gallery/kamp-gallery/ because other pages still use
// a few of them as local art; the migration uploads copies into Sanity rather than
// moving anything.

export type KampGalleryPhoto = {
  file: string
  alt: string
}

export type KampGalleryAlbum = {
  slug: string
  title: string
  /** Date only, matching the galleryEvent schema's `date` field. */
  date: string
  university: string
  year: number
  theme?: string
  recap?: string
  coverFile: string
  coverAlt: string
  photos: KampGalleryPhoto[]
}

/** Where the seed files live, relative to public/. */
export const GALLERY_IMAGE_DIR = '/images/gallery/kamp-gallery'

// The curated opening spread, in slot order, so the mosaic reads exactly as it was
// designed before anyone touches an arrow. These fourteen fill the visible grid; the
// rest of the album sits behind the "+N" tile.
const featuredPhotos: KampGalleryPhoto[] = [
  { file: 'DSC05916.jpg', alt: 'KAMP guests at Emerge 2025' },
  { file: 'DSC06029.jpg', alt: 'Emerge 2025 attendees' },
  { file: 'DSC06037.jpg', alt: 'KAMP event guests' },
  { file: 'DSC06240.jpg', alt: 'KAMP speaker at Emerge' },
  { file: 'DSC06469.jpg', alt: 'KAMP media team' },
  { file: 'DSC05537.jpg', alt: 'KAMP participants' },
  { file: 'DSC05684.jpg', alt: 'KAMP volunteer team' },
  { file: 'DSC05984.jpg', alt: 'Emerge 2025 embrace' },
  { file: 'DSC06092.jpg', alt: 'KAMP attendees walking' },
  { file: 'DSC05771.jpg', alt: 'KAMP mentor speaking' },
  { file: 'DSC06118.jpg', alt: 'KAMP community gathering' },
  { file: 'DSC05783.jpg', alt: 'KAMP audience' },
  { file: 'DSC06155.jpg', alt: 'KAMP Emerge group photo' },
  { file: 'DSC05487.jpg', alt: 'KAMP participant' },
]

// The remainder of the album, in the order the old page listed them.
//
// "DSC06092 (1).jpg" is deliberately absent: it is byte-identical to DSC06092.jpg,
// which is already in the featured spread above. Sanity deduplicates assets by
// content, so keeping both would have shown the same photo twice in one album.
const remainingFiles = [
  'DSC05642.jpg', 'DSC05647.jpg', 'DSC05709.jpg', 'DSC05786.jpg', 'DSC05794.jpg',
  'DSC05803.jpg', 'DSC05804.jpg', 'DSC05888.jpg', 'DSC05919.jpg', 'DSC05967.jpg',
  'DSC05992.jpg', 'DSC05995.jpg', 'DSC05997.jpg', 'DSC06018.jpg', 'DSC06023.jpg',
  'DSC06027.jpg', 'DSC06031.jpg', 'DSC06045.jpg', 'DSC06125.jpg', 'DSC06165.jpg',
  'DSC06175.jpg', 'DSC06192.jpg', 'DSC06217.jpg', 'DSC06284 (1).jpg', 'DSC06309 (1).jpg',
  'DSC06476.jpg', 'DSC06568 (1).jpg', 'DSC06607.jpg', 'DSC06634.jpg', 'DSC06644 (1).jpg',
  'DSC07802.jpg', 'DSC07808.jpg', 'DSC07816.jpg', 'DSC07824.jpg', 'DSC08059.jpg',
  'DSC08080.jpg', 'DSC08164.jpg', 'DSC08172.jpg', 'DSC08353.jpg', 'DSC08362.jpg',
  'DSC08367.jpg', 'DSC08404.jpg', 'DSC08429.jpg', 'DSC08453.jpg', 'DSC08479.jpg',
  'DSC08589.jpg', 'DSC08673.jpg', 'DSC08697.jpg', 'DSC08719.jpg', 'DSC08764.jpg',
  'DSC08779.jpg', 'DSC08785.jpg', 'DSC08794.jpg',
]

// The old page titled this spread "Emerge 2026", but that event is dated October 2026
// and is still upcoming — these are photographs of the October 2025 edition, so the
// album is filed under Emerge 2025 to match the `event` document of the same name.
const emerge2025: KampGalleryAlbum = {
  slug: 'emerge-2025',
  title: 'Emerge 2025',
  date: '2025-10-19',
  university: 'University of Ibadan',
  year: 2025,
  theme: 'Rise into your purpose',
  recap:
    'A full day of insight, connection, and practical leadership conversations for students committed to making a difference.',
  coverFile: 'DSC05783.jpg',
  coverAlt: 'KAMP Emerge 2025 audience',
  photos: [
    ...featuredPhotos,
    ...remainingFiles.map((file) => ({ file, alt: 'KAMP Emerge 2025 event moment' })),
  ],
}

export const kampGalleryAlbums: KampGalleryAlbum[] = [emerge2025]
