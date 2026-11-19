ALTER TABLE public.registration_email_attempts
  ADD COLUMN IF NOT EXISTS support_request_id UUID
    REFERENCES public.membership_support_requests(id) ON DELETE SET NULL;
