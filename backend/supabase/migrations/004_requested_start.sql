-- The time a client originally asked for, kept when the studio moves a
-- pending request so the confirmation email can say the time changed.
alter table public.bookings add column if not exists requested_start timestamptz;
