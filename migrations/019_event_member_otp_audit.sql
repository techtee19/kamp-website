CREATE TABLE IF NOT EXISTS public.event_member_otp_audit (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  event_id TEXT,
  outcome TEXT NOT NULL CHECK (outcome IN (
    'invalid_request',
    'event_unavailable',
    'service_unavailable',
    'rate_limited',
    'member_not_found',
    'email_accepted',
    'email_rejected',
    'code_verified',
    'code_invalid',
    'system_error'
  )),
  provider_message_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS event_member_otp_audit_created_idx
  ON public.event_member_otp_audit (created_at DESC);

CREATE INDEX IF NOT EXISTS event_member_otp_audit_event_created_idx
  ON public.event_member_otp_audit (event_id, created_at DESC);

ALTER TABLE public.event_member_otp_audit ENABLE ROW LEVEL SECURITY;
