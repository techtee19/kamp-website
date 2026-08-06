-- ── events_registrations ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS events_registrations (
  id           SERIAL PRIMARY KEY,
  event_id     TEXT          NOT NULL,
  event_title  TEXT          NOT NULL,
  full_name    TEXT          NOT NULL,
  email        TEXT          NOT NULL,
  phone        TEXT          NOT NULL,
  university   TEXT          NOT NULL,
  study_level  TEXT          NOT NULL,
  status       TEXT          NOT NULL DEFAULT 'confirmed'
                             CHECK (status IN ('confirmed', 'waitlisted', 'cancelled')),
  created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_registrations_event_id
  ON events_registrations(event_id);

CREATE INDEX IF NOT EXISTS idx_registrations_email
  ON events_registrations(email);

-- ── donations ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS donations (
  id               SERIAL PRIMARY KEY,
  paystack_ref     TEXT           UNIQUE NOT NULL,
  donor_name       TEXT           NOT NULL,
  donor_email      TEXT           NOT NULL,
  amount_kobo      INTEGER        NOT NULL,
  amount_ngn       NUMERIC(12,2)  NOT NULL,
  donation_type    TEXT           NOT NULL
                                  CHECK (donation_type IN ('one_time', 'recurring')),
  status           TEXT           NOT NULL DEFAULT 'pending'
                                  CHECK (status IN ('pending', 'success', 'failed')),
  paystack_status  TEXT,
  message          TEXT,
  receipt_sent     BOOLEAN        NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  paid_at          TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_donations_paystack_ref
  ON donations(paystack_ref);

CREATE INDEX IF NOT EXISTS idx_donations_email
  ON donations(donor_email);

-- ── contact_submissions ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_submissions (
  id          SERIAL PRIMARY KEY,
  name        TEXT          NOT NULL,
  email       TEXT          NOT NULL,
  subject     TEXT          NOT NULL,
  message     TEXT          NOT NULL,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);
