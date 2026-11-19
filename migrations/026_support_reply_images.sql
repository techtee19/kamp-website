CREATE TABLE public.membership_support_reply_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reply_id UUID NOT NULL REFERENCES public.membership_support_replies(id) ON DELETE CASCADE,
  position SMALLINT NOT NULL CHECK (position BETWEEN 0 AND 2),
  filename TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('image/png', 'image/jpeg')),
  content BYTEA NOT NULL CHECK (OCTET_LENGTH(content) BETWEEN 1 AND 2097152),
  sha256 TEXT NOT NULL,
  UNIQUE (reply_id, position)
);
ALTER TABLE public.membership_support_reply_images ENABLE ROW LEVEL SECURITY;
