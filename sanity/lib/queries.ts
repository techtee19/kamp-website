import { createImageUrlBuilder } from '@sanity/image-url'
import { client } from './client'

// ── Image URL builder ─────────────────────────────────────────
// backend.md §3.8 uses the default export; that is deprecated in the installed
// version of @sanity/image-url, so this uses the named export instead.
const builder = createImageUrlBuilder(client ?? undefined)
export const urlFor = (source: unknown) =>
  builder.image(source as Parameters<typeof builder.image>[0])

// ── Events ────────────────────────────────────────────────────

// Every event projection dereferences the image asset to a plain CDN url so the
// pages can hand it straight to next/image. `_type` and `isPublished` are
// projected even though the filters already imply them, so the shape actually
// matches EventDocument rather than leaving those two fields undefined at runtime.
const eventImage = `{ asset->{ url }, alt }`

// Every published event that has not concluded, ordered by date.
// Filtering on `status != "past"` rather than `status == "upcoming"` is deliberate:
// an event switched to "ongoing" on the day it runs used to match neither this
// query nor PAST_EVENTS_QUERY, so it vanished from the site mid-event. The two
// filters are now complements, which means every published event appears in
// exactly one of the listing's two sections.
export const UPCOMING_EVENTS_QUERY = `
  *[_type == "event" && isPublished == true && status != "past"] | order(date asc) {
    _id, _type, title, slug, date, university, location, theme, status, capacity, isPublished,
    registrationClosed,
    coverImage ${eventImage}
  }
`

// All published past events
export const PAST_EVENTS_QUERY = `
  *[_type == "event" && isPublished == true && status == "past"] | order(date desc) {
    _id, _type, title, slug, date, university, location, theme, status, isPublished,
    coverImage ${eventImage}
  }
`

// Single event by slug (for /events/[slug] page)
export const EVENT_BY_SLUG_QUERY = `
  *[_type == "event" && slug.current == $slug && isPublished == true][0] {
    _id, _type, title, slug, date, university, location, theme, status, capacity, isPublished,
    registrationClosed, description,
    coverImage ${eventImage},
    galleryImages[] ${eventImage}
  }
`

// Most recent unconcluded event (for Home page featured event). Matches
// UPCOMING_EVENTS_QUERY's filter so an ongoing event stays featured while it runs.
export const FEATURED_EVENT_QUERY = `
  *[_type == "event" && isPublished == true && status != "past"] | order(date asc)[0] {
    _id, _type, title, slug, date, university, location, theme, status, isPublished,
    coverImage ${eventImage}
  }
`

// Slugs of every published event — feeds generateStaticParams for /events/[slug]
export const EVENT_SLUGS_QUERY = `
  *[_type == "event" && isPublished == true && defined(slug.current)] { slug }
`

// Single event by _id — used by /api/register to read capacity, date and location
export const EVENT_BY_ID_QUERY = `
  *[_type == "event" && _id == $id][0] {
    capacity, date, location
  }
`

// ── Gallery ───────────────────────────────────────────────────

// All gallery events, newest first. Image assets are dereferenced to plain CDN
// urls so the page can hand them straight to next/image, matching the pattern the
// event queries above use. `_type` is projected for the same reason it is there:
// GalleryEventDocument declares it, so leaving it out would make the runtime shape
// disagree with the type.
//
// The urls carry Sanity's own resize parameters because the originals are 4-7MB
// exports up to 6900px wide. Handing those to next/image made its optimizer time out
// and return 500s once an album filled the fourteen-slot mosaic; asking Sanity to
// downscale first turns a 3.7MB fetch into 364KB and the timeouts go away. The
// numbers are the widest either surface can display: the mosaic and lightbox tiles
// never exceed a third of a wide viewport, while a cover also fills the full-bleed
// hero. next/image still produces the responsive srcset from these.
const GALLERY_PHOTO_WIDTH = 1600
const GALLERY_COVER_WIDTH = 2400

export const GALLERY_EVENTS_QUERY = `
  *[_type == "galleryEvent"] | order(date desc) {
    _id,
    _type,
    title,
    date,
    university,
    theme,
    year,
    recap,
    coverImage {
      "asset": { "url": asset->url + "?w=${GALLERY_COVER_WIDTH}&q=80" },
      alt
    },
    photos[] {
      "asset": { "url": asset->url + "?w=${GALLERY_PHOTO_WIDTH}&q=80" },
      alt,
      caption
    },
    videoUrl,
    pressLinks
  }
`

// ── Team ──────────────────────────────────────────────────────

// All team members, ordered by display order
export const TEAM_MEMBERS_QUERY = `
  *[_type == "teamMember"] | order(order asc) {
    _id, name, role, bio, photo, isFounder, quote, linkedinUrl
  }
`

// Founder only (for About page prominent section)
export const FOUNDER_QUERY = `
  *[_type == "teamMember" && isFounder == true][0] {
    _id, name, role, bio, photo, quote, linkedinUrl
  }
`

// ── Programs ──────────────────────────────────────────────────

export const PROGRAMS_QUERY = `
  *[_type == "program"] | order(order asc) {
    _id, title, description, icon
  }
`

// ── Site Settings ─────────────────────────────────────────────

export const SITE_SETTINGS_QUERY = `
  *[_type == "siteSettings"][0] {
    siteName, missionStatement, contactEmail, contactPhone,
    officeAddress, instagramUrl, linkedinUrl, donationCTA, impactStats
  }
`
