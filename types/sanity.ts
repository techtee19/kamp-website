export interface SanityImage {
  _type: 'image'
  asset: { _ref: string; _type: 'reference' }
  hotspot?: { x: number; y: number; height: number; width: number }
}

// An image after the event queries have dereferenced its asset to a CDN url.
// `asset` is nullable because a projection over a missing image yields null.
export interface SanityResolvedImage {
  asset: { url: string } | null
  alt?: string
}

export interface SanitySlug {
  _type: 'slug'
  current: string
}

export interface SanityBlock {
  _type: 'block'
  children: Array<{ _type: 'span'; text: string; marks: string[] }>
  markDefs: unknown[]
  style: string
}

export interface EventDocument {
  _id: string
  _type: 'event'
  title: string
  slug: SanitySlug
  date: string
  university: string
  location: string
  theme?: string
  status: 'upcoming' | 'ongoing' | 'past'
  capacity?: number
  description?: SanityBlock[]
  coverImage: SanityResolvedImage | null
  galleryImages?: SanityResolvedImage[]
  isPublished: boolean
}

export interface GalleryEventDocument {
  _id: string
  _type: 'galleryEvent'
  title: string
  date: string
  university: string
  theme?: string
  year: number
  recap?: string
  coverImage: SanityImage
  photos: SanityImage[]
  videoUrl?: string
  pressLinks?: Array<{ outlet: string; headline: string; url: string }>
}

export interface TeamMemberDocument {
  _id: string
  _type: 'teamMember'
  name: string
  role: string
  bio: string
  photo: SanityImage
  isFounder: boolean
  quote?: string
  order: number
  linkedinUrl?: string
}

export interface ProgramDocument {
  _id: string
  _type: 'program'
  title: string
  description: SanityBlock[]
  icon?: string
  order: number
}

export interface SiteSettings {
  siteName: string
  missionStatement: string
  contactEmail: string
  contactPhone: string
  officeAddress: string
  instagramUrl: string
  linkedinUrl: string
  donationCTA: string
  impactStats: Array<{ value: string; label: string }>
}
