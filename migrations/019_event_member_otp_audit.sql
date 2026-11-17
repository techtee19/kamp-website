CREATE TABLE IF NOT EXISTS public.event_member_otp_audit (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  event_id TEXT,
  outcome TEXT NOT NULL,
  provider_message_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS event_member_otp_audit_created_idx ON public.event_member_otp_audit (created_at);
ALTER TABLE public.event_member_otp_audit ENABLE ROW LEVEL SECURITY;
