import { createImageUrlBuilder } from '@sanity/image-url'
import { client } from './client'

// ── Image URL builder ─────────────────────────────────────────
// backend.md §3.8 uses the default export; that is deprecated in the installed
// version of @sanity/image-url, so this uses the named export instead.
const builder = createImageUrlBuilder(client ?? undefined)
export const urlFor = (source: unknown) =>
  builder.image(source as Parameters<typeof builder.image>[0])

// ── Events ────────────────────────────────────────────────────

// All published upcoming events, ordered by date
export const UPCOMING_EVENTS_QUERY = `
  *[_type == "event" && isPublished == true && status == "upcoming"] | order(date asc) {
    _id, title, slug, date, university, location, theme, status, coverImage, capacity
  }
`

// All published past events
export const PAST_EVENTS_QUERY = `
  *[_type == "event" && isPublished == true && status == "past"] | order(date desc) {
    _id, title, slug, date, university, location, theme, status, coverImage
  }
`

// Single event by slug (for /events/[slug] page)
export const EVENT_BY_SLUG_QUERY = `
  *[_type == "event" && slug.current == $slug && isPublished == true][0] {
    _id, title, slug, date, university, location, theme, description, coverImage, capacity, status, galleryImages
  }
`

// Most recent upcoming event (for Home page featured event)
export const FEATURED_EVENT_QUERY = `
  *[_type == "event" && isPublished == true && status == "upcoming"] | order(date asc)[0] {
    _id, title, slug, date, university, location, theme, coverImage
  }
`

// Single event by _id — used by /api/register to read capacity, date and location
export const EVENT_BY_ID_QUERY = `
  *[_type == "event" && _id == $id][0] {
    capacity, date, location
  }
`

// ── Gallery ───────────────────────────────────────────────────

// All gallery events, newest first
export const GALLERY_EVENTS_QUERY = `
  *[_type == "galleryEvent"] | order(date desc) {
    _id, title, date, university, theme, year, recap, coverImage, photos, videoUrl, pressLinks
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
