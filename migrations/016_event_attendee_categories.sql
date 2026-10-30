DO $$
DECLARE
  registered_event RECORD;
BEGIN
  FOR registered_event IN
    SELECT table_name
    FROM public.event_tables_registry
    WHERE table_name ~ '^reg_[a-z0-9_]{1,43}$'
      AND to_regclass(format('public.%I', table_name)) IS NOT NULL
  LOOP
    EXECUTE format(
      'ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS attendee_type TEXT NOT NULL DEFAULT ''student''',
      registered_event.table_name
    );
    EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS occupation TEXT', registered_event.table_name);
    EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS organization TEXT', registered_event.table_name);
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint
      WHERE conrelid = format('public.%I', registered_event.table_name)::regclass
        AND conname = LEFT(registered_event.table_name, 43) || '_attendee_type_check'
    ) THEN
      EXECUTE format(
        'ALTER TABLE public.%I ADD CONSTRAINT %I CHECK (attendee_type IN (''student'', ''professional'', ''non_professional''))',
        registered_event.table_name, LEFT(registered_event.table_name, 43) || '_attendee_type_check'
      );
    END IF;
  END LOOP;
END $$;
