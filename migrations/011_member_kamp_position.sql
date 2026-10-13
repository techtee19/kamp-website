ALTER TABLE public.members
  ADD COLUMN IF NOT EXISTS kamp_position TEXT NOT NULL DEFAULT 'General Member';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'members_kamp_position_length_check'
      AND conrelid = 'public.members'::regclass
  ) THEN
    ALTER TABLE public.members
      ADD CONSTRAINT members_kamp_position_length_check
      CHECK (char_length(kamp_position) BETWEEN 2 AND 48 AND BTRIM(kamp_position) <> '');
  END IF;
END;
$$;
