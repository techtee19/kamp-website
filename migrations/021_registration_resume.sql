ALTER TABLE public.event_member_verifications
  ADD COLUMN IF NOT EXISTS verification_request_id UUID,
  ADD COLUMN IF NOT EXISTS registration_ticket_ref TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS event_member_verifications_request_idx
  ON public.event_member_verifications (verification_request_id)
  WHERE verification_request_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.membership_submission_receipts (
  key_hash TEXT PRIMARY KEY,
  payload_hash TEXT NOT NULL,
  member_id TEXT NOT NULL REFERENCES public.members(member_id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.membership_submission_receipts ENABLE ROW LEVEL SECURITY;
