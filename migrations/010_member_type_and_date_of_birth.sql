ALTER TABLE public.members
  ADD COLUMN IF NOT EXISTS membership_type TEXT NOT NULL DEFAULT 'student',
  ADD COLUMN IF NOT EXISTS date_of_birth DATE,
  ADD COLUMN IF NOT EXISTS occupation TEXT,
  ADD COLUMN IF NOT EXISTS organization TEXT;

-- Non-students do not have a tertiary institution or study level.
ALTER TABLE public.members
  ALTER COLUMN university DROP NOT NULL,
  ALTER COLUMN study_level DROP NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'members_membership_type_check'
      AND conrelid = 'public.members'::regclass
  ) THEN
    ALTER TABLE public.members
      ADD CONSTRAINT members_membership_type_check
      CHECK (membership_type IN ('student', 'professional', 'non_professional'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'members_profile_type_fields_check'
      AND conrelid = 'public.members'::regclass
  ) THEN
    ALTER TABLE public.members
      ADD CONSTRAINT members_profile_type_fields_check
      CHECK (
        (membership_type = 'student' AND university IS NOT NULL AND study_level IS NOT NULL)
        OR
        (membership_type IN ('professional', 'non_professional') AND occupation IS NOT NULL AND BTRIM(occupation) <> '')
      );
  END IF;
END;
$$;
