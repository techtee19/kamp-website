CREATE TABLE IF NOT EXISTS member_number_counters (
  year_joined INTEGER PRIMARY KEY,
  last_number INTEGER NOT NULL CHECK (last_number > 0)
);

CREATE TABLE IF NOT EXISTS members (
  id BIGSERIAL PRIMARY KEY,
  member_id TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  university TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female')),
  state_of_origin TEXT NOT NULL,
  study_level TEXT NOT NULL,
  why_join TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  year_joined INTEGER NOT NULL,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS members_status_idx ON members (status);
CREATE INDEX IF NOT EXISTS members_year_joined_idx ON members (year_joined);
