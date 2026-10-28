CREATE TABLE IF NOT EXISTS public.event_member_verifications (
  challenge_id UUID PRIMARY KEY,
  event_id TEXT NOT NULL,
  member_id TEXT NOT NULL REFERENCES public.members(member_id) ON DELETE CASCADE,
  code_hash CHAR(64) NOT NULL CHECK (code_hash ~ '^[a-f0-9]{64}$'),
  attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  verified_at TIMESTAMPTZ,
  consumed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS event_member_verifications_expiry_idx
  ON public.event_member_verifications (expires_at);

ALTER TABLE public.event_member_verifications ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  registered_event RECORD;
BEGIN
  FOR registered_event IN
    SELECT table_name
    FROM public.event_tables_registry
    WHERE table_name ~ '^reg_[a-z0-9_]{1,43}$'
      AND to_regclass(format('public.%I', table_name)) IS NOT NULL
  LOOP
    EXECUTE format(
      'ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS member_id TEXT REFERENCES public.members(member_id)',
      registered_event.table_name
    );
    EXECUTE format('ALTER TABLE public.%I ALTER COLUMN university DROP NOT NULL', registered_event.table_name);
    EXECUTE format('ALTER TABLE public.%I ALTER COLUMN study_level DROP NOT NULL', registered_event.table_name);
    EXECUTE format(
      'CREATE UNIQUE INDEX IF NOT EXISTS %I ON public.%I (member_id) WHERE member_id IS NOT NULL',
      registered_event.table_name || '_member_id_key', registered_event.table_name
    );
  END LOOP;
END $$;
