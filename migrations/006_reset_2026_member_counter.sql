-- Reset the 2026 member-number counter after removing test registrations.
-- Only clear the counter when no real 2026 member records remain. This is safe
-- to re-run: after the first new member is created, it will leave the counter intact.
DELETE FROM member_number_counters AS counters
WHERE counters.year_joined = 2026
  AND NOT EXISTS (
    SELECT 1 FROM members WHERE members.year_joined = counters.year_joined
  );
