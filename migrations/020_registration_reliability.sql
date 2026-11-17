ALTER TABLE public.event_member_verifications ADD COLUMN IF NOT EXISTS pending_delivery BOOLEAN NOT NULL DEFAULT FALSE;
CREATE INDEX IF NOT EXISTS event_member_otp_member_idx
  ON public.event_member_verifications (event_id, member_id) WHERE consumed_at IS NULL;
CREATE INDEX IF NOT EXISTS members_active_normalized_id_idx
  ON public.members (UPPER(member_id)) WHERE status = 'active';
ALTER TABLE public.event_member_otp_audit ADD COLUMN IF NOT EXISTS provider_error_code TEXT;
CREATE TABLE IF NOT EXISTS public.event_otp_provider_delivery (
  provider_message_id TEXT PRIMARY KEY,
  status TEXT NOT NULL,
  provider_event_at TIMESTAMPTZ NOT NULL
);
ALTER TABLE public.event_otp_provider_delivery ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.registration_email_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind TEXT NOT NULL CHECK (kind IN ('welcome', 'ticket')),
  member_id TEXT NOT NULL REFERENCES public.members(member_id) ON DELETE CASCADE,
  reference TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  attachment BYTEA,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','sending','accepted','delivered','delayed','bounced','suppressed','failed','unknown')),
  attempts INT NOT NULL DEFAULT 0,
  generation INT NOT NULL DEFAULT 1,
  first_send_at TIMESTAMPTZ,
  uncertain_delivery BOOLEAN NOT NULL DEFAULT FALSE,
  claimed_until TIMESTAMPTZ,
  next_retry_at TIMESTAMPTZ DEFAULT NOW(),
  provider_message_id TEXT UNIQUE,
  provider_event_at TIMESTAMPTZ,
  error_category TEXT,
  error_code TEXT,
  failed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (kind, reference)
);
CREATE INDEX IF NOT EXISTS registration_email_jobs_ready_idx ON public.registration_email_jobs (next_retry_at)
  WHERE status IN ('pending','sending');
CREATE TABLE IF NOT EXISTS public.registration_email_attempts (
  job_id UUID NOT NULL REFERENCES public.registration_email_jobs(id) ON DELETE CASCADE,
  attempt INT NOT NULL,
  generation INT NOT NULL,
  outcome TEXT NOT NULL DEFAULT 'sending',
  error_category TEXT,
  error_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (job_id, generation, attempt)
);
ALTER TABLE public.registration_email_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_email_attempts ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.membership_support_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reply_email TEXT NOT NULL,
  member_id_hint TEXT,
  message TEXT NOT NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.membership_correction_audit (
  support_id UUID PRIMARY KEY REFERENCES public.membership_support_requests(id),
  member_id TEXT NOT NULL,
  action TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.membership_support_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_correction_audit ENABLE ROW LEVEL SECURITY;
