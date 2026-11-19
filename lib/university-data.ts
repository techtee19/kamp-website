import { db } from '@/lib/db'
import { canonicalInstitution } from '@/lib/institution-names'

export type UniversityCount = { university: string; fullName: string; count: number; needsReview: boolean }

export async function getUniversityCounts(): Promise<UniversityCount[]> {
  const rows = await db`
    SELECT university, COUNT(*)::int AS count FROM members
    WHERE membership_type = 'student' AND university IS NOT NULL AND BTRIM(university) <> ''
    GROUP BY university ORDER BY university
  `
  const groups = new Map<string, UniversityCount>()
  for (const row of rows) {
    const resolved = canonicalInstitution(String(row.university))
    const group = groups.get(resolved.key)
    if (group) group.count += Number(row.count)
    else groups.set(resolved.key, {
      fullName: resolved.name, university: resolved.name.length > 24 ? resolved.name.slice(0, 22) + '…' : resolved.name,
      count: Number(row.count), needsReview: !resolved.recognized,
    })
  }
  return [...groups.values()].sort((a, b) => b.count - a.count || a.fullName.localeCompare(b.fullName, 'en'))
}

export async function getUniversityRoster(university: string) {
  const requestedKey = canonicalInstitution(university).key
  const names = await db`
    SELECT DISTINCT university FROM members
    WHERE membership_type = 'student' AND university IS NOT NULL AND BTRIM(university) <> ''
  `
  const variants = names.map((row) => String(row.university))
    .filter((name) => canonicalInstitution(name).key === requestedKey)
  if (!variants.length) return []
  return db`
    SELECT member_id, first_name, last_name, email, phone, study_level, kamp_position, status, joined_at
    FROM members WHERE membership_type = 'student'
      AND university IN (SELECT jsonb_array_elements_text(${db.json(variants)}::jsonb))
    ORDER BY last_name ASC, first_name ASC, member_id ASC
  `
}
