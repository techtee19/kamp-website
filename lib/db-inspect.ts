// Throwaway verification of what the API routes actually wrote — deleted after use.
import { db } from '@/lib/db'

async function inspect() {
  try {
    const registrations = await db`
      SELECT id, event_id, event_title, full_name, email, phone, university,
             study_level, status, created_at
      FROM events_registrations ORDER BY id
    `
    console.log('events_registrations:', registrations.length, 'row(s)')
    console.table(registrations)

    const contacts = await db`
      SELECT id, name, email, subject, created_at FROM contact_submissions ORDER BY id
    `
    console.log('contact_submissions:', contacts.length, 'row(s)')
    console.table(contacts)

    const donations = await db`SELECT count(*)::int AS n FROM donations`
    console.log('donations:', donations[0].n, 'row(s)')
  } catch (err) {
    console.error('❌ inspect failed:', err)
    process.exitCode = 1
  } finally {
    process.exit()
  }
}

inspect()
