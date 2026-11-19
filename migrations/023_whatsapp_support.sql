ALTER TABLE public.membership_support_requests
  ADD COLUMN IF NOT EXISTS issue_type TEXT NOT NULL DEFAULT 'membership'
    CHECK (issue_type IN ('membership', 'whatsapp')),
  ADD COLUMN IF NOT EXISTS whatsapp_number TEXT
    CHECK (whatsapp_number IS NULL OR whatsapp_number ~ '^\+[1-9][0-9]{7,14}$'),
  ADD COLUMN IF NOT EXISTS whatsapp_added_at TIMESTAMPTZ;
