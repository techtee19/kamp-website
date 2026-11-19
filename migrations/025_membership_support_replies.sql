ALTER TABLE public.registration_email_jobs DROP CONSTRAINT IF EXISTS registration_email_jobs_kind_check;
ALTER TABLE public.registration_email_jobs ADD CONSTRAINT registration_email_jobs_kind_check
  CHECK (kind IN ('welcome', 'ticket', 'support_reply'));
ALTER TABLE public.registration_email_jobs ALTER COLUMN member_id DROP NOT NULL;
ALTER TABLE public.registration_email_jobs ADD CONSTRAINT registration_email_jobs_member_required
  CHECK (kind = 'support_reply' OR member_id IS NOT NULL);

CREATE TABLE public.membership_support_replies (
  id UUID PRIMARY KEY,
  support_id UUID NOT NULL REFERENCES public.membership_support_requests(id) ON DELETE CASCADE,
  job_id UUID NOT NULL UNIQUE REFERENCES public.registration_email_jobs(id),
  recipient TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX membership_support_replies_request_idx ON public.membership_support_replies (support_id, created_at);
ALTER TABLE public.membership_support_replies ENABLE ROW LEVEL SECURITY;
