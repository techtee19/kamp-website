import { createHash } from 'node:crypto'
import { db } from '@/lib/db'

export class DuplicateRegistrationError extends Error {
  constructor() {
    super('Already registered for this event')
    this.name = 'DuplicateRegistrationError'
  }
}

export class EventFullError extends Error {
  constructor() {
    super('Event has reached maximum capacity')
    this.name = 'EventFullError'
  }
}

function assertSafeTableName(tableName: string): void {
  if (!/^reg_[a-z0-9_]{1,43}$/.test(tableName)) {
    throw new Error('Invalid event registration table name')
  }
}

// Include an event-id digest so distinct slugs that normalize to the same
// identifier cannot accidentally share a registration table.
export function slugToTableName(slug: string, eventId: string): string {
  const sanitized = slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '_')
    .replace(/^_+|_+$/g, '')
  const stem = sanitized.slice(0, 30) || 'event'
  const suffix = createHash('sha256').update(eventId).digest('hex').slice(0, 12)
  const tableName = `reg_${stem}_${suffix}`
  assertSafeTableName(tableName)
  return tableName
}

export async function createEventRegistrationTable(
  eventId: string,
  eventSlug: string,
  eventTitle: string
): Promise<{ tableName: string; created: boolean }> {
  if (!eventId || !eventSlug || !eventTitle) throw new Error('Invalid event details')

  return db.begin(async (tx) => {
    // Serialize table creation for the same Sanity event across webhook retries
    // and the registration route's fallback path.
    await tx`SELECT pg_advisory_xact_lock(hashtextextended(${eventId}, 0))`

    const existing = await tx`
      SELECT table_name FROM event_tables_registry WHERE event_id = ${eventId} LIMIT 1
    `

    if (existing.length > 0) {
      const tableName = existing[0].table_name as string
      assertSafeTableName(tableName)
      await tx`
        UPDATE event_tables_registry
        SET event_slug = ${eventSlug}, event_title = ${eventTitle}
        WHERE event_id = ${eventId}
      `
      return { tableName, created: false }
    }

    const tableName = slugToTableName(eventSlug, eventId)
    const quotedTable = `"${tableName}"`

    await tx.unsafe(`
      CREATE TABLE ${quotedTable} (
        id          SERIAL PRIMARY KEY,
        event_id    TEXT NOT NULL,
        event_title TEXT NOT NULL,
        full_name   TEXT NOT NULL,
        email       TEXT NOT NULL UNIQUE,
        phone       TEXT NOT NULL,
        university  TEXT NOT NULL,
        study_level TEXT NOT NULL,
        status      TEXT NOT NULL DEFAULT 'confirmed'
                    CHECK (status IN ('confirmed', 'waitlisted', 'cancelled')),
        ticket_ref  TEXT UNIQUE,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)

    await tx`
      INSERT INTO event_tables_registry (event_id, event_slug, event_title, table_name)
      VALUES (${eventId}, ${eventSlug}, ${eventTitle}, ${tableName})
    `

    return { tableName, created: true }
  })
}

export async function getEventTableName(eventId: string): Promise<string | null> {
  const result = await db`
    SELECT table_name FROM event_tables_registry WHERE event_id = ${eventId} LIMIT 1
  `
  if (result.length === 0) return null
  const tableName = result[0].table_name as string
  assertSafeTableName(tableName)
  return tableName
}

export async function insertRegistrationAtomic(params: {
  eventId: string
  eventTitle: string
  fullName: string
  email: string
  phone: string
  university: string
  studyLevel: string
  ticketRef: string
  tableName: string
  capacity?: number
}): Promise<void> {
  assertSafeTableName(params.tableName)
  const quotedTable = `"${params.tableName}"`

  try {
    await db.begin(async (tx) => {
      // Every registration for one event takes the same transaction lock. This
      // serializes the count and insert, including when no rows exist to lock.
      await tx`SELECT pg_advisory_xact_lock(hashtextextended(${params.eventId}, 0))`

      const registeredTable = await tx`
        SELECT 1 FROM event_tables_registry
        WHERE event_id = ${params.eventId} AND table_name = ${params.tableName}
        LIMIT 1
      `
      if (registeredTable.length === 0) throw new Error('Event registration table not found')

      await tx.unsafe(
        `INSERT INTO ${quotedTable}
          (event_id, event_title, full_name, email, phone, university, study_level, status, ticket_ref)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'confirmed', $8)`,
        [
          params.eventId,
          params.eventTitle,
          params.fullName,
          params.email.toLowerCase(),
          params.phone,
          params.university,
          params.studyLevel,
          params.ticketRef,
        ]
      )

      // Count after the insert, then roll the insert back if it exceeded the
      // limit. A duplicate hits the unique email constraint first, even when
      // the event is currently full.
      if (params.capacity !== undefined && params.capacity > 0) {
        const result = await tx.unsafe(
          `SELECT COUNT(*) AS count FROM ${quotedTable} WHERE status != 'cancelled'`
        )
        if (Number(result[0].count) > params.capacity) throw new EventFullError()
      }
    })
  } catch (err) {
    const emailConstraint = `${params.tableName}_email_key`
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      err.code === '23505' &&
      'constraint_name' in err &&
      err.constraint_name === emailConstraint
    ) {
      throw new DuplicateRegistrationError()
    }
    throw err
  }
}
