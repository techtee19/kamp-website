import { db } from '@/lib/db'
import { quoteEventTableName } from '@/lib/admin-data'

export type SignupMonth = { month: string; count: number }
export type UniversityCount = { university: string; fullName: string; count: number }
export type CategoryCount = { label: string; count: number; percentage: number }
export type GenderCount = CategoryCount & { gender: string }
export type EventRegistrationCount = { count: number; available: boolean }

function isMissingTableError(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === '42P01'
}

export async function getEventRegistrationCount(tableName: unknown): Promise<EventRegistrationCount> {
  const table = quoteEventTableName(tableName)

  try {
    const [row] = await db.unsafe(`SELECT COUNT(*)::int AS count FROM ${table} WHERE status <> 'cancelled'`)
    return { count: Number(row?.count ?? 0), available: true }
  } catch (error) {
    if (!isMissingTableError(error)) throw error

    console.warn(`[admin] Registration table ${table} is missing; skipping its count.`)
    return { count: 0, available: false }
  }
}

export async function getMonthlySignups(): Promise<SignupMonth[]> {
  const rows = await db`
    WITH months AS (
      SELECT generate_series(
        date_trunc('month', CURRENT_DATE) - INTERVAL '11 months',
        date_trunc('month', CURRENT_DATE),
        INTERVAL '1 month'
      ) AS month_start
    )
    SELECT
      TO_CHAR(months.month_start, 'Mon YY') AS month,
      COUNT(m.id)::int AS count
    FROM months
    LEFT JOIN members AS m
      ON m.joined_at >= months.month_start
     AND m.joined_at < months.month_start + INTERVAL '1 month'
    GROUP BY months.month_start
    ORDER BY months.month_start
  `

  return rows.map((row) => ({ month: String(row.month), count: Number(row.count) }))
}

export async function getTopUniversities(): Promise<UniversityCount[]> {
  const rows = await db`
    SELECT
      MIN(BTRIM(university)) AS full_name,
      COUNT(*)::int AS count
    FROM members
    WHERE BTRIM(university) <> ''
    GROUP BY LOWER(REGEXP_REPLACE(BTRIM(university), '\\s+', ' ', 'g'))
    ORDER BY COUNT(*) DESC, full_name ASC
    LIMIT 10
  `

  return rows.map((row) => {
    const fullName = String(row.full_name)
    return {
      university: fullName.length > 24 ? `${fullName.slice(0, 22)}…` : fullName,
      fullName,
      count: Number(row.count),
    }
  })
}

export async function getTopStates(): Promise<CategoryCount[]> {
  const rows = await db`
    SELECT state_of_origin AS label, COUNT(*)::int AS count
    FROM members
    GROUP BY state_of_origin
    ORDER BY COUNT(*) DESC, state_of_origin ASC
    LIMIT 10
  `

  const total = rows.reduce((sum, row) => sum + Number(row.count), 0)
  return rows.map((row) => {
    const count = Number(row.count)
    return { label: String(row.label), count, percentage: total ? Math.round((count / total) * 100) : 0 }
  })
}

export async function getStudyLevelBreakdown(): Promise<CategoryCount[]> {
  const rows = await db`
    SELECT study_level AS label, COUNT(*)::int AS count
    FROM members
    GROUP BY study_level
    ORDER BY COUNT(*) DESC, study_level ASC
  `

  const total = rows.reduce((sum, row) => sum + Number(row.count), 0)
  return rows.map((row) => {
    const count = Number(row.count)
    return { label: String(row.label), count, percentage: total ? Math.round((count / total) * 100) : 0 }
  })
}

export async function getGenderBreakdown(): Promise<GenderCount[]> {
  const rows = await db`
    SELECT gender, COUNT(*)::int AS count
    FROM members
    GROUP BY gender
    ORDER BY COUNT(*) DESC, gender ASC
  `

  const total = rows.reduce((sum, row) => sum + Number(row.count), 0)
  return rows.map((row) => {
    const gender = String(row.gender)
    const count = Number(row.count)
    return {
      gender,
      label: gender,
      count,
      percentage: total ? Math.round((count / total) * 100) : 0,
    }
  })
}

export async function getYearOnYearGrowth() {
  const [row] = await db`
    WITH bounds AS (
      SELECT
        date_trunc('year', CURRENT_TIMESTAMP) AS current_start,
        CURRENT_TIMESTAMP AS current_end,
        date_trunc('year', CURRENT_TIMESTAMP) - INTERVAL '1 year' AS previous_start,
        CURRENT_TIMESTAMP - INTERVAL '1 year' AS previous_end
    )
    SELECT
      COUNT(*) FILTER (
        WHERE joined_at >= bounds.current_start AND joined_at < bounds.current_end
      )::int AS current_count,
      COUNT(*) FILTER (
        WHERE joined_at >= bounds.previous_start AND joined_at < bounds.previous_end
      )::int AS previous_count,
      EXTRACT(YEAR FROM bounds.current_start)::int AS current_year,
      (EXTRACT(YEAR FROM bounds.current_start) - 1)::int AS previous_year
    FROM members CROSS JOIN bounds
    GROUP BY bounds.current_start
  `

  const currentYearCount = Number(row?.current_count ?? 0)
  const previousYearCount = Number(row?.previous_count ?? 0)
  return {
    currentYear: Number(row?.current_year ?? new Date().getFullYear()),
    previousYear: Number(row?.previous_year ?? new Date().getFullYear() - 1),
    currentYearCount,
    previousYearCount,
    growthPercent: previousYearCount > 0
      ? Math.round(((currentYearCount - previousYearCount) / previousYearCount) * 100)
      : null,
  }
}

export async function getTotalEventRegistrations(): Promise<{ count: number; unavailableTables: number }> {
  const registry = await db`SELECT table_name FROM event_tables_registry`
  const counts = await Promise.all(registry.map(async (event) => {
    return getEventRegistrationCount(event.table_name)
  }))

  return {
    count: counts.reduce((sum, result) => sum + result.count, 0),
    unavailableTables: counts.filter((result) => !result.available).length,
  }
}
