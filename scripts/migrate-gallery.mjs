// One-shot migration: moves the pre-CMS photo album in lib/gallery-data.ts into Sanity
// so the Gallery page renders it again and the media team can edit it in the Studio.
//
//   npm run migrate:gallery -- --dry-run   # validate and print, upload and write nothing
//   npm run migrate:gallery                # create anything missing
//   npm run migrate:gallery -- --replace   # overwrite existing docs from seed data
//
// Safe to re-run. Documents use deterministic ids (`gallery-<slug>`) and are created
// with createIfNotExists, so a second run reports "exists" instead of duplicating or
// clobbering Studio edits. Photos are matched by original filename, so re-runs reuse the
// assets already in the dataset rather than uploading 300MB again — the same lookup also
// picks up the five covers that `migrate:events` already uploaded.

import { createReadStream } from 'node:fs'
import { access, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@sanity/client'
import { GALLERY_IMAGE_DIR, kampGalleryAlbums } from '../lib/gallery-data.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const IMAGE_ROOT = path.join(ROOT, 'public')

const DRY_RUN = process.argv.includes('--dry-run')
const REPLACE = process.argv.includes('--replace')

// The album is ~300MB of 4-5MB photos, so uploads run a few at a time. Kept low
// deliberately: Sanity throttles bursts, and a failed batch costs more than the
// wall-clock this saves.
const UPLOAD_CONCURRENCY = 4

function requireEnv(name) {
  const value = process.env[name]
  if (!value) {
    throw new Error(
      `Missing ${name}. Run through "npm run migrate:gallery" so .env.local is loaded.`
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

const absolutePathFor = (file) =>
  path.join(IMAGE_ROOT, GALLERY_IMAGE_DIR.replace(/^\//, ''), file)

/**
 * Checks every file in the album exists before a single byte is uploaded, so a typo in
 * the seed data fails the run outright instead of leaving a half-populated document.
 */
async function assertFilesExist(files) {
  const missing = []
  for (const file of files) {
    try {
      await access(absolutePathFor(file))
    } catch {
      missing.push(file)
    }
  }
  if (missing.length) {
    throw new Error(`${missing.length} file(s) missing from public${GALLERY_IMAGE_DIR}: ${missing.join(', ')}`)
  }
}

/** Every asset already in the dataset, keyed by original filename, for reuse. */
async function fetchExistingAssets(files) {
  const rows = await client.fetch(
    `*[_type == "sanity.imageAsset" && originalFilename in $files]{ _id, originalFilename }`,
    { files }
  )
  return new Map(rows.map((row) => [row.originalFilename, row._id]))
}

/**
 * Uploads one photo, reusing the existing asset when one with the same original
 * filename is already in the dataset.
 */
async function resolveAsset(file, existing) {
  const reusedId = existing.get(file)
  if (reusedId) return { file, _id: reusedId, reused: true }

  if (DRY_RUN) return { file, _id: `<upload ${file}>`, reused: false }

  const absolute = absolutePathFor(file)
  const asset = await client.assets.upload('image', createReadStream(absolute), {
    filename: file,
  })
  return { file, _id: asset._id, reused: false }
}

/** Maps `worker` over `items` a few at a time, preserving input order in the results. */
async function mapWithConcurrency(items, limit, worker) {
  const results = new Array(items.length)
  let cursor = 0

  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++
      results[index] = await worker(items[index], index)
    }
  })

  await Promise.all(runners)
  return results
}

function buildDocument(album, assetIdByFile) {
  return {
    _id: `gallery-${album.slug}`,
    _type: 'galleryEvent',
    title: album.title,
    date: album.date,
    university: album.university,
    year: album.year,
    ...(album.theme ? { theme: album.theme } : {}),
    ...(album.recap ? { recap: album.recap } : {}),
    coverImage: {
      _type: 'image',
      asset: { _type: 'reference', _ref: assetIdByFile.get(album.coverFile) },
      alt: album.coverAlt,
    },
    // Keys are derived from the index so re-running with --replace keeps the same keys
    // rather than churning every array item in the Studio's history.
    photos: album.photos.map((photo, index) => ({
      _type: 'image',
      _key: `${album.slug}-photo-${index}`,
      asset: { _type: 'reference', _ref: assetIdByFile.get(photo.file) },
      alt: photo.alt,
    })),
  }
}

async function migrateAlbum(album) {
  // The cover is part of the album on the page, but it is a separate field in the
  // schema, so it needs uploading whether or not it also appears in photos[].
  const files = [...new Set([album.coverFile, ...album.photos.map((photo) => photo.file)])]

  await assertFilesExist(files)

  const bytes = (
    await Promise.all(files.map(async (file) => (await stat(absolutePathFor(file))).size))
  ).reduce((total, size) => total + size, 0)

  const existing = await fetchExistingAssets(files)
  console.log(
    `  ${album.slug}: ${album.photos.length} photos, ${files.length} distinct files, ` +
      `${(bytes / 1048576).toFixed(0)}MB on disk — ${existing.size} already in the dataset`
  )

  let done = 0
  const assets = await mapWithConcurrency(files, UPLOAD_CONCURRENCY, async (file) => {
    const asset = await resolveAsset(file, existing)
    done += 1
    console.log(
      `    [${String(done).padStart(2)}/${files.length}] ${asset.reused ? 'reuse ' : 'upload'} ${file}`
    )
    return asset
  })

  const assetIdByFile = new Map(assets.map((asset) => [asset.file, asset._id]))
  const doc = buildDocument(album, assetIdByFile)
  const uploaded = assets.filter((asset) => !asset.reused).length

  if (DRY_RUN) {
    console.log(
      `  plan   ${album.slug} "${doc.title}" | ${doc.date} | ${doc.university} | ` +
        `${doc.photos.length} photos | ${uploaded} to upload, ${assets.length - uploaded} reused`
    )
    return 'planned'
  }

  if (REPLACE) {
    await client.createOrReplace(doc)
    console.log(`  wrote  ${album.slug} "${doc.title}" (replaced)`)
    return 'replaced'
  }

  const before = await client.fetch(`defined(*[_id == $id][0]._id)`, { id: doc._id })
  await client.createIfNotExists(doc)

  if (before) {
    console.log(`  exists ${album.slug} left untouched (use --replace to overwrite)`)
    return 'skipped'
  }

  console.log(`  wrote  ${album.slug} "${doc.title}" with ${doc.photos.length} photos`)
  return 'created'
}

async function main() {
  console.log(
    `\n${DRY_RUN ? 'DRY RUN — ' : ''}migrating ${kampGalleryAlbums.length} gallery album(s) ` +
      `into project ${projectId} / dataset ${dataset}` +
      `${REPLACE && !DRY_RUN ? ' (--replace: existing docs will be overwritten)' : ''}\n`
  )

  const results = []

  for (const album of kampGalleryAlbums) {
    try {
      results.push({ slug: album.slug, action: await migrateAlbum(album) })
    } catch (error) {
      console.error(`  FAIL   ${album.slug} ${error.message}`)
      results.push({ slug: album.slug, action: 'failed', error })
    }
  }

  const count = (action) => results.filter((result) => result.action === action).length
  const failed = count('failed')

  console.log(
    `\n${DRY_RUN ? 'planned' : 'created'} ${count(DRY_RUN ? 'planned' : 'created')}` +
      `, replaced ${count('replaced')}, skipped ${count('skipped')}, failed ${failed}\n`
  )

  if (failed) process.exitCode = 1
}

await main()
