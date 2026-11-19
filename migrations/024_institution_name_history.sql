CREATE TABLE IF NOT EXISTS public.member_institution_name_history (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  member_id TEXT NOT NULL REFERENCES public.members(member_id) ON DELETE CASCADE,
  previous_name TEXT NOT NULL,
  canonical_name TEXT NOT NULL,
  corrected_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.member_institution_name_history ENABLE ROW LEVEL SECURITY;
