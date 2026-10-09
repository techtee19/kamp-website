DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN
    SELECT table_name FROM public.event_tables_registry
  LOOP
    IF tbl !~ '^reg_[a-z0-9_]{1,43}$' THEN
      RAISE EXCEPTION 'Unsafe event registration table name in registry';
    END IF;
    IF to_regclass(format('public.%I', tbl)) IS NULL THEN
      CONTINUE;
    END IF;
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tbl);
    EXECUTE format(
      'ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS checked_in BOOLEAN NOT NULL DEFAULT FALSE', tbl
    );
    EXECUTE format(
      'ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS checked_in_at TIMESTAMPTZ', tbl
    );
  END LOOP;
END;
$$;
