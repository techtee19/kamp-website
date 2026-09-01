// Throwaway migration runner — deleted once the schema is in place.
import { readFileSync } from 'node:fs'
import { db } from '@/lib/db'

const files = ['migrations/001_init.sql', 'migrations/002_registration_unique.sql']

async function migrate() {
  try {
    for (const file of files) {
      // .simple() is required: the extended protocol rejects multi-statement SQL.
      await db.unsafe(readFileSync(file, 'utf8')).simple()
      console.log(`✅ applied ${file}`)
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
