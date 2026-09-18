ALTER TABLE events_registrations
  ADD COLUMN IF NOT EXISTS ticket_ref TEXT UNIQUE;
