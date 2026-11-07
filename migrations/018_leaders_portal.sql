CREATE TABLE IF NOT EXISTS public.leaders (
  id            SERIAL PRIMARY KEY,
  full_name     TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  phone         TEXT,
  role          TEXT NOT NULL CHECK (role IN ('campus_leader', 'executive')),
  campus        TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMPTZ,
  CONSTRAINT leaders_email_lower CHECK (email = LOWER(email))
);

CREATE TABLE IF NOT EXISTS public.leader_login_tokens (
  id          SERIAL PRIMARY KEY,
  leader_id   INTEGER NOT NULL REFERENCES public.leaders(id) ON DELETE CASCADE,
  token_hash  TEXT NOT NULL UNIQUE,
  expires_at  TIMESTAMPTZ NOT NULL,
  used_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_login_tokens_leader
  ON public.leader_login_tokens (leader_id);
CREATE INDEX IF NOT EXISTS idx_login_tokens_expiry
  ON public.leader_login_tokens (expires_at);

CREATE TABLE IF NOT EXISTS public.leader_reports (
  id            SERIAL PRIMARY KEY,
  leader_id     INTEGER NOT NULL REFERENCES public.leaders(id) ON DELETE RESTRICT,
  report_type   TEXT NOT NULL CHECK (report_type IN ('monthly', 'event', 'other')),
  title         TEXT NOT NULL,
  report_date   DATE NOT NULL,
  events_held   INTEGER CHECK (events_held IS NULL OR events_held >= 0),
  attendance    INTEGER CHECK (attendance IS NULL OR attendance >= 0),
  summary       TEXT NOT NULL,
  achievements  TEXT,
  challenges    TEXT,
  next_steps    TEXT,
  links         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_reports_leader ON public.leader_reports (leader_id);
CREATE INDEX IF NOT EXISTS idx_reports_created ON public.leader_reports (created_at DESC);

CREATE TABLE IF NOT EXISTS public.leader_requests (
  id                SERIAL PRIMARY KEY,
  leader_id         INTEGER NOT NULL REFERENCES public.leaders(id) ON DELETE RESTRICT,
  request_type      TEXT NOT NULL CHECK (request_type IN ('funding', 'materials', 'approval', 'support', 'other')),
  title             TEXT NOT NULL,
  description       TEXT NOT NULL,
  event_name        TEXT,
  event_date        DATE,
  amount_requested  NUMERIC(14,2) CHECK (amount_requested IS NULL OR amount_requested > 0),
  budget_breakdown  TEXT,
  needed_by         DATE,
  links             TEXT,
  status            TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'more_info_needed', 'approved', 'declined')),
  review_note       TEXT,
  reviewed_at       TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT funding_needs_amount CHECK (request_type <> 'funding' OR amount_requested IS NOT NULL),
  CONSTRAINT funding_needs_breakdown CHECK (request_type <> 'funding' OR NULLIF(BTRIM(budget_breakdown), '') IS NOT NULL)
);
CREATE INDEX IF NOT EXISTS idx_requests_leader ON public.leader_requests (leader_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON public.leader_requests (status);
CREATE INDEX IF NOT EXISTS idx_requests_created ON public.leader_requests (created_at DESC);

ALTER TABLE public.leaders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leader_login_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leader_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leader_requests ENABLE ROW LEVEL SECURITY;
