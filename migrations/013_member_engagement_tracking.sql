CREATE TABLE IF NOT EXISTS public.member_community_tracking (
  member_id TEXT PRIMARY KEY REFERENCES public.members(member_id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ,
  joined_by TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK ((joined_at IS NULL) = (joined_by IS NULL))
);

CREATE TABLE IF NOT EXISTS public.member_community_invite_links (
  id BIGSERIAL PRIMARY KEY,
  member_id TEXT NOT NULL REFERENCES public.members(member_id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE CHECK (token_hash ~ '^[a-f0-9]{64}$'),
  email_sent_at TIMESTAMPTZ,
  click_count INTEGER NOT NULL DEFAULT 0 CHECK (click_count >= 0),
  first_clicked_at TIMESTAMPTZ,
  last_clicked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK ((click_count = 0 AND first_clicked_at IS NULL AND last_clicked_at IS NULL)
    OR (click_count > 0 AND first_clicked_at IS NOT NULL AND last_clicked_at IS NOT NULL))
);

CREATE INDEX IF NOT EXISTS member_community_invite_links_member_idx
  ON public.member_community_invite_links (member_id);

-- These records are only accessed by the server with DATABASE_URL. Do not
-- expose member tracking metadata or token hashes through the public Data API.
ALTER TABLE public.member_community_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_community_invite_links ENABLE ROW LEVEL SECURITY;

-- Existing members can be marked as joined by an admin. Historical email links
-- were direct WhatsApp URLs, so their clicks cannot be reconstructed.
INSERT INTO public.member_community_tracking (member_id)
SELECT member_id FROM public.members
ON CONFLICT (member_id) DO NOTHING;
