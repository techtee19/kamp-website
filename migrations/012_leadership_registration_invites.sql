CREATE TABLE IF NOT EXISTS public.leadership_member_id_counters (
  role_code TEXT PRIMARY KEY CHECK (role_code IN ('FND', 'COF', 'BRD')),
  year_issued INTEGER NOT NULL CHECK (year_issued BETWEEN 2020 AND 9999),
  last_number INTEGER NOT NULL CHECK (last_number BETWEEN 1 AND 15),
  max_number INTEGER NOT NULL CHECK (max_number IN (1, 15)),
  CHECK (last_number <= max_number),
  CHECK ((role_code IN ('FND', 'COF') AND max_number = 1) OR (role_code = 'BRD' AND max_number = 15))
);

CREATE TABLE IF NOT EXISTS public.leadership_registration_invites (
  id BIGSERIAL PRIMARY KEY,
  invitee_email TEXT NOT NULL,
  role_code TEXT NOT NULL CHECK (role_code IN ('FND', 'COF', 'BRD')),
  token_hash CHAR(64) NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  consumed_at TIMESTAMPTZ,
  consumed_member_id TEXT UNIQUE REFERENCES public.members(member_id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK ((consumed_at IS NULL AND consumed_member_id IS NULL) OR (consumed_at IS NOT NULL AND consumed_member_id IS NOT NULL))
);

-- An email can have only one unredeemed leadership invitation at a time.
CREATE UNIQUE INDEX IF NOT EXISTS leadership_invites_pending_email_idx
  ON public.leadership_registration_invites (LOWER(invitee_email))
  WHERE consumed_at IS NULL;

CREATE INDEX IF NOT EXISTS leadership_invites_expiry_idx
  ON public.leadership_registration_invites (expires_at)
  WHERE consumed_at IS NULL;
