ALTER TABLE public.members
  ADD COLUMN IF NOT EXISTS passport_photo BYTEA,
  ADD COLUMN IF NOT EXISTS passport_photo_type TEXT;

-- Member data is accessed by the server with DATABASE_URL, not directly by
-- browser roles through Supabase's Data API.
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'members_passport_photo_size_check'
      AND conrelid = 'public.members'::regclass
  ) THEN
    ALTER TABLE public.members
      ADD CONSTRAINT members_passport_photo_size_check
      CHECK (passport_photo IS NULL OR octet_length(passport_photo) <= 2097152);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'members_passport_photo_type_check'
      AND conrelid = 'public.members'::regclass
  ) THEN
    ALTER TABLE public.members
      ADD CONSTRAINT members_passport_photo_type_check
      CHECK (passport_photo_type IS NULL OR passport_photo_type IN ('image/jpeg', 'image/png'));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'members_passport_photo_pair_check'
      AND conrelid = 'public.members'::regclass
  ) THEN
    ALTER TABLE public.members
      ADD CONSTRAINT members_passport_photo_pair_check
      CHECK ((passport_photo IS NULL) = (passport_photo_type IS NULL));
  END IF;
END;
$$;
