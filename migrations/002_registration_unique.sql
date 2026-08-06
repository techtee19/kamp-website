-- Optional hardening (not in backend.md §2, safe to run after 001_init.sql).
--
-- /api/register checks for an existing registration before inserting, but two
-- concurrent requests can both pass that check and insert duplicate rows. This
-- unique index makes the database the source of truth; the route translates the
-- resulting 23505 unique_violation into the same 409 response.
--
-- If duplicates already exist, delete them before running this.

CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_event_email_unique
  ON events_registrations(event_id, email);
