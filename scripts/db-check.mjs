// Standalone DB connectivity checker — run with:
// node --env-file=.env.local scripts/db-check.mjs
import postgres from 'postgres'

const url = process.env.DATABASE_URL
if (!url) {
  console.error('❌  DATABASE_URL is not set in .env.local')
  process.exit(1)
}

console.log('Connecting to:', url.replace(/:([^:@]+)@/, ':***@')) // mask password

const db = postgres(url, {
  ssl: { rejectUnauthorized: false },
  connect_timeout: 15,
  max: 1,
})

try {
  // 1. Basic connectivity
  const [{ time }] = await db`SELECT NOW() AS time`
  console.log('✅  Connected! Server time:', time)

  // 2. Check which tables exist
  const tables = await db`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name
  `
  const names = tables.map((t) => t.table_name)
  console.log('\nTables in public schema:', names.length ? names.join(', ') : '(none)')

  const required = ['contact_submissions', 'donations', 'events_registrations']
  const missing = required.filter((t) => !names.includes(t))
  if (missing.length) {
    console.warn('\n⚠️  Missing tables:', missing.join(', '))
    console.warn('   Run: node --env-file=.env.local --experimental-strip-types lib/db-migrate.ts')
  } else {
    console.log('✅  All required tables are present!')

    // 3. Quick row counts
    const [{ n: nContacts }] = await db`SELECT COUNT(*)::int AS n FROM contact_submissions`
    const [{ n: nReg }] = await db`SELECT COUNT(*)::int AS n FROM events_registrations`
    const [{ n: nDon }] = await db`SELECT COUNT(*)::int AS n FROM donations`
    console.log(`\nRow counts:`)
    console.log(`  contact_submissions : ${nContacts}`)
    console.log(`  events_registrations: ${nReg}`)
    console.log(`  donations           : ${nDon}`)
  }
} catch (err) {
  console.error('❌  DB error:', err.message)
  if (err.message.includes('connect_timeout') || err.message.includes('ETIMEDOUT')) {
    console.error('\n   Hint: Supabase pooler (port 6543) may be blocked by your network/firewall.')
    console.error(
      '   Try switching DATABASE_URL to port 5432 (direct connection) and add ?sslmode=require'
    )
    console.error(
      '   Or check your Supabase project → Settings → Database for the correct connection string.'
    )
  }
  process.exitCode = 1
} finally {
  await db.end()
}
