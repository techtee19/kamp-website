CREATE TABLE IF NOT EXISTS public.community_email_campaign_recipients (
  campaign_key TEXT NOT NULL,
  member_id TEXT NOT NULL REFERENCES public.members(member_id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sending', 'sent', 'failed')),
  attempt_count INTEGER NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
  last_error TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (campaign_key, member_id),
  CHECK ((status = 'sent') = (sent_at IS NOT NULL))
);

CREATE INDEX IF NOT EXISTS community_email_campaign_pending_idx
  ON public.community_email_campaign_recipients (campaign_key, status, created_at);

ALTER TABLE public.community_email_campaign_recipients ENABLE ROW LEVEL SECURITY;
