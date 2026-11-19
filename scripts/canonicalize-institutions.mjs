import { readFileSync } from 'node:fs'
import postgres from 'postgres'
import { canonicalInstitution } from '../lib/institution-names.ts'

const apply = process.argv.includes('--apply')
const sql = postgres(process.env.DATABASE_URL, {
  ssl: { rejectUnauthorized: false }, prepare: false, max: 1, connect_timeout: 10,
})

try {
  const report = await sql.begin('isolation level repeatable read', async (tx) => {
    if (apply) {
      await tx`SELECT pg_advisory_xact_lock(hashtextextended('kamp_schema_migrations'::text, 0))`
      const migration = '024_institution_name_history.sql'
      const [applied] = await tx`SELECT name FROM schema_migrations WHERE name = ${migration}`
      if (!applied) {
        await tx.unsafe(readFileSync(new URL('../migrations/' + migration, import.meta.url), 'utf8')).simple()
        await tx`INSERT INTO schema_migrations (name) VALUES (${migration})`
      }
    }
    const [totals] = await tx`
      SELECT COUNT(*)::int AS members, COUNT(*) FILTER (WHERE membership_type = 'student')::int AS students
      FROM members
    `
    const rows = await tx`
      SELECT university, COUNT(*)::int AS count FROM members
      WHERE membership_type = 'student' AND university IS NOT NULL AND BTRIM(university) <> ''
      GROUP BY university ORDER BY university
    `
    const changes = []
    const groups = new Map()
    let corrected = 0
    for (const row of rows) {
      const resolved = canonicalInstitution(row.university)
      const group = groups.get(resolved.key) ?? { name: resolved.name, members: 0, needsReview: !resolved.recognized }
      group.members += row.count
      groups.set(resolved.key, group)
      if (!resolved.recognized || resolved.name === row.university) continue
      changes.push({ from: row.university, to: resolved.name, members: row.count })
      if (apply) {
        const history = await tx`
          WITH changed AS (
            UPDATE members SET university = ${resolved.name}
            WHERE membership_type = 'student' AND university = ${row.university}
            RETURNING member_id
          )
          INSERT INTO member_institution_name_history (member_id, previous_name, canonical_name)
          SELECT member_id, ${row.university}, ${resolved.name} FROM changed
          RETURNING id
        `
        corrected += history.length
      }
    }
    const [after] = await tx`
      SELECT COUNT(*)::int AS members, COUNT(*) FILTER (WHERE membership_type = 'student')::int AS students
      FROM members
    `
    if (totals.members !== after.members || totals.students !== after.students) throw new Error('Member counts changed during cleanup')
    return {
      applied: apply, ...totals, corrected, changes,
      groups: [...groups.values()].sort((a, b) => b.members - a.members || a.name.localeCompare(b.name)),
    }
  })
  console.log(JSON.stringify(report))
} catch (error) {
  console.error(JSON.stringify({ error: error.code ?? error.name }))
  process.exitCode = 1
} finally {
  await sql.end()
}
