CREATE TABLE IF NOT EXISTS public.security_rate_limits (
  key_hash          CHAR(64) PRIMARY KEY CHECK (key_hash ~ '^[a-f0-9]{64}$'),
  window_started_at TIMESTAMPTZ NOT NULL,
  window_ms         INTEGER NOT NULL CHECK (window_ms > 0),
  request_count     INTEGER NOT NULL CHECK (request_count > 0),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS security_rate_limits_updated_at_idx
  ON public.security_rate_limits (updated_at);
