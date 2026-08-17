// One-shot migration: moves the five pre-CMS events in lib/event-data.ts into
// Sanity so they render on the site again and are editable in the Studio.
//
//   npm run migrate:events -- --dry-run   # validate and print, write nothing
//   npm run migrate:events                # create anything missing
//   npm run migrate:events -- --replace   # overwrite existing docs from seed data
//
// Safe to re-run. Documents use deterministic ids (`event-<slug>`) and are created
// with createIfNotExists, so a second run reports "exists" instead of duplicating
// or clobbering Studio edits. Cover images are matched by original filename so
// re-runs reuse the asset already in the dataset rather than uploading again.

import { createReadStream } from 'node:fs'
import { access } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@sanity/client'
import { kampEvents } from '../lib/event-data.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const IMAGE_ROOT = path.join(ROOT, 'public')

const DRY_RUN = process.argv.includes('--dry-run')
const REPLACE = process.argv.includes('--replace')

// Nigeria is UTC+1 year-round (WAT, no DST), so the offset can be a constant.
// Building the ISO string by hand keeps the result independent of the timezone
// of whichever machine runs the migration.
const WAT_OFFSET = '+01:00'

const MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
]

const pad = (n) => String(n).padStart(2, '0')

/** 'October 24, 2026' + '9:00 AM' -> '2026-10-24T09:00:00+01:00' */
function toIsoDateTime(dateText, timeText) {
  const date = /^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})$/.exec(dateText.trim())
  if (!date) throw new Error(`Unrecognised date: "${dateText}"`)

  const month = MONTHS.indexOf(date[1].toLowerCase()) + 1
  if (month === 0) throw new Error(`Unrecognised month: "${date[1]}"`)

  const time = /^(\d{1,2}):(\d{2})\s*([AaPp])\.?[Mm]\.?$/.exec(timeText.trim())
  if (!time) throw new Error(`Unrecognised time: "${timeText}"`)

  const hour = (Number(time[1]) % 12) + (time[3].toLowerCase() === 'p' ? 12 : 0)
  return `${date[3]}-${pad(month)}-${pad(Number(date[2]))}T${pad(hour)}:${time[2]}:00${WAT_OFFSET}`
}

/** The schema stores description as Portable Text; the seed data is one paragraph. */
function toPortableText(text, slug) {
  return [
    {
      _type: 'block',
      _key: `${slug}-body`,
      style: 'normal',
      markDefs: [],
      children: [
        { _type: 'span', _key: `${slug}-body-0`, text, marks: [] },
      ],
    },
  ]
}

function requireEnv(name) {
  const value = process.env[name]
  if (!value) {
    throw new Error(
      `Missing ${name}. Run through "npm run migrate:events" so .env.local is loaded.`
    )
  }
  return value
}

const projectId = requireEnv('NEXT_PUBLIC_SANITY_PROJECT_ID')
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = DRY_RUN ? process.env.SANITY_API_TOKEN : requireEnv('SANITY_API_TOKEN')

const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-08-15',
  token,
  useCdn: false,
})

/**
 * Uploads a local cover image, reusing the existing asset when one with the same
 * original filename is already in the dataset.
 */
async function resolveImageAsset(publicPath) {
  const absolute = path.join(IMAGE_ROOT, publicPath.replace(/^\//, ''))
  await access(absolute) // throws before any writes happen if a cover is missing

  const filename = path.basename(absolute)

  const existing = await client.fetch(
    `*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id`,
    { filename }
  )
  if (existing) return { _id: existing, reused: true }

  if (DRY_RUN) return { _id: `<upload ${filename}>`, reused: false }

  const asset = await client.assets.upload('image', createReadStream(absolute), {
    filename,
  })
  return { _id: asset._id, reused: false }
}

function buildDocument(event, assetId) {
  const doc = {
    _id: `event-${event.slug}`,
    _type: 'event',
    title: event.title,
    slug: { _type: 'slug', current: event.slug },
    date: toIsoDateTime(event.date, event.time),
    university: event.university,
    location: event.location,
    theme: event.theme,
    description: toPortableText(event.description, event.slug),
    coverImage: {
      _type: 'image',
      asset: { _type: 'reference', _ref: assetId },
      // The seed data carried no alt text. This is a serviceable default that
      // names the event and venue; editors should refine it in the Studio.
      alt: `${event.title} at ${event.university}`,
    },
    status: event.status,
    registrationClosed: event.registrationClosed ?? false,
    // These five were live on the site before the CMS, so they go back published.
    isPublished: true,
  }

  // capacity is absent from the seed data; leaving the field off means "unlimited"
  // rather than writing an explicit null the Studio would show as a cleared number.
  return doc
}

async function main() {
  console.log(
    `\n${DRY_RUN ? 'DRY RUN — ' : ''}migrating ${kampEvents.length} events ` +
      `into project ${projectId} / dataset ${dataset}` +
      `${REPLACE && !DRY_RUN ? ' (--replace: existing docs will be overwritten)' : ''}\n`
  )

  const results = []

  for (const event of kampEvents) {
    const label = `${event.slug.padEnd(26)}`
    try {
      const asset = await resolveImageAsset(event.image)
      const doc = buildDocument(event, asset._id)

      if (DRY_RUN) {
        console.log(
          `  plan   ${label} "${doc.title}" | ${doc.date} | ${doc.status}` +
            `${doc.registrationClosed ? ' | registration closed' : ''}` +
            ` | image ${asset.reused ? 'reused' : 'upload'} ${path.basename(event.image)}`
        )
        results.push({ slug: event.slug, action: 'planned' })
        continue
      }

      if (REPLACE) {
        await client.createOrReplace(doc)
        console.log(`  wrote  ${label} "${doc.title}" (replaced)`)
        results.push({ slug: event.slug, action: 'replaced' })
        continue
      }

      const before = await client.fetch(`defined(*[_id == $id][0]._id)`, {
        id: doc._id,
      })
      await client.createIfNotExists(doc)

      if (before) {
        console.log(`  exists ${label} left untouched (use --replace to overwrite)`)
        results.push({ slug: event.slug, action: 'skipped' })
      } else {
        console.log(`  wrote  ${label} "${doc.title}"`)
        results.push({ slug: event.slug, action: 'created' })
      }
    } catch (error) {
      console.error(`  FAIL   ${label} ${error.message}`)
      results.push({ slug: event.slug, action: 'failed', error })
    }
  }

  const count = (action) => results.filter((r) => r.action === action).length
  const failed = count('failed')

  console.log(
    `\n${DRY_RUN ? 'planned' : 'created'} ${count(DRY_RUN ? 'planned' : 'created')}` +
      `, replaced ${count('replaced')}, skipped ${count('skipped')}, failed ${failed}\n`
  )

  if (failed) process.exitCode = 1
}

await main()
