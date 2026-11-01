CREATE TABLE IF NOT EXISTS public.event_checkin_operators (
  id BIGSERIAL PRIMARY KEY,
  event_slug TEXT NOT NULL REFERENCES public.event_tables_registry(event_slug) ON DELETE CASCADE,
  email TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (event_slug, email)
);

CREATE INDEX IF NOT EXISTS event_checkin_operators_email_idx
  ON public.event_checkin_operators (email, event_slug)
  WHERE enabled = TRUE;

CREATE TABLE IF NOT EXISTS public.event_checkin_login_codes (
  challenge_id UUID PRIMARY KEY,
  operator_id BIGINT NOT NULL REFERENCES public.event_checkin_operators(id) ON DELETE CASCADE,
  code_hash CHAR(64) NOT NULL CHECK (code_hash ~ '^[a-f0-9]{64}$'),
  attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  consumed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS event_checkin_login_codes_operator_idx
  ON public.event_checkin_login_codes (operator_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.event_checkin_sessions (
  token_hash CHAR(64) PRIMARY KEY CHECK (token_hash ~ '^[a-f0-9]{64}$'),
  operator_id BIGINT NOT NULL REFERENCES public.event_checkin_operators(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS event_checkin_sessions_operator_idx
  ON public.event_checkin_sessions (operator_id, expires_at);

CREATE TABLE IF NOT EXISTS public.event_checkin_audit (
  id BIGSERIAL PRIMARY KEY,
  event_slug TEXT NOT NULL REFERENCES public.event_tables_registry(event_slug) ON DELETE CASCADE,
  registration_id INTEGER NOT NULL,
  ticket_ref TEXT NOT NULL,
  operator_id BIGINT REFERENCES public.event_checkin_operators(id) ON DELETE SET NULL,
  actor_email TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('checked_in', 'reverted')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS event_checkin_audit_event_created_idx
  ON public.event_checkin_audit (event_slug, created_at DESC);

ALTER TABLE public.event_checkin_operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_checkin_login_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_checkin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_checkin_audit ENABLE ROW LEVEL SECURITY;
