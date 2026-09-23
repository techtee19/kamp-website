-- Preserve the existing shared registration table as a read-only archive.
DO $$
BEGIN
  IF to_regclass('public.events_registrations') IS NOT NULL
     AND to_regclass('public.events_registrations_legacy') IS NULL THEN
    ALTER TABLE public.events_registrations RENAME TO events_registrations_legacy;
  ELSIF to_regclass('public.events_registrations') IS NOT NULL
        AND to_regclass('public.events_registrations_legacy') IS NOT NULL THEN
    RAISE EXCEPTION 'Both events_registrations and events_registrations_legacy exist; refusing to rename';
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.event_tables_registry (
  id          SERIAL PRIMARY KEY,
  event_id    TEXT NOT NULL UNIQUE,
  event_slug  TEXT NOT NULL UNIQUE,
  event_title TEXT NOT NULL,
  table_name  TEXT NOT NULL UNIQUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_registry_event_id
  ON public.event_tables_registry(event_id);

CREATE INDEX IF NOT EXISTS idx_registry_event_slug
  ON public.event_tables_registry(event_slug);
