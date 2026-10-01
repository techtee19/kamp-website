// Applies tracked database migrations and prints the resulting public tables.
import { readFileSync } from 'node:fs'
// This script runs directly in Node rather than through Next.js, so it cannot
// resolve the app's `@/` alias. Keep this import relative for `pnpm db:migrate`.
import { db } from './db.ts'

const files = [
  { name: '001_init.sql', path: 'migrations/001_init.sql' },
  { name: '002_registration_unique.sql', path: 'migrations/002_registration_unique.sql' },
  { name: '003_registration_ticket_ref.sql', path: 'migrations/003_registration_ticket_ref.sql' },
  { name: '004_event_tables_registry.sql', path: 'migrations/004_event_tables_registry.sql' },
  { name: '005_members.sql', path: 'migrations/005_members.sql' },
  { name: '006_reset_2026_member_counter.sql', path: 'migrations/006_reset_2026_member_counter.sql' },
]

async function migrate() {
  try {
    await db`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        name TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `

    // If migration 004 was run manually, recognize its resulting schema and
    // avoid replaying 001, which would recreate the archived table's old name.
    const migratedSchema = await db`
      SELECT
        to_regclass('public.events_registrations_legacy') IS NOT NULL AS has_legacy,
        to_regclass('public.event_tables_registry') IS NOT NULL AS has_registry
    `
    if (migratedSchema[0].has_legacy && migratedSchema[0].has_registry) {
      await db`
        INSERT INTO schema_migrations (name)
        VALUES ('001_init.sql'), ('002_registration_unique.sql'),
               ('003_registration_ticket_ref.sql'), ('004_event_tables_registry.sql')
        ON CONFLICT (name) DO NOTHING
      `
    }

    for (const file of files) {
      const applied = await db`
        SELECT 1 FROM schema_migrations WHERE name = ${file.name} LIMIT 1
      `
      if (applied.length > 0) continue

      await db.begin(async (tx) => {
        // .simple() is required: extended protocol rejects multi-statement SQL.
        await tx.unsafe(readFileSync(file.path, 'utf8')).simple()
        await tx`INSERT INTO schema_migrations (name) VALUES (${file.name})`
      })
      console.log(`✅ applied ${file.path}`)
    }

    const tables = await db`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' ORDER BY table_name
    `
    console.log('Tables:', tables.map((t) => t.table_name))

    const indexes = await db`
      SELECT indexname FROM pg_indexes
      WHERE schemaname = 'public' ORDER BY indexname
    `
    console.log('Indexes:', indexes.map((i) => i.indexname))
  } catch (err) {
    console.error('❌ migration failed:', err)
    process.exitCode = 1
  } finally {
    process.exit()
  }
}

migrate()
