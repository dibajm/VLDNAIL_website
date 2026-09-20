create extension if not exists pgcrypto;

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'held' check (status in ('held', 'confirmed', 'declined', 'cancelled', 'expired')),
  hold_expires_at timestamptz not null,
  appointment_start timestamptz not null,
  duration_minutes integer not null check (duration_minutes > 0),
  service_type text not null check (service_type in ('newSet', 'fill')),
  service text not null,
  nail_length text,
  nail_shape text,
  design_tier integer check (design_tier between 1 and 4),
  extras jsonb not null default '[]'::jsonb,
  contact jsonb not null,
  constraint bookings_contact_object check (jsonb_typeof(contact) = 'object')
);

create index if not exists bookings_appointment_start_idx
  on public.bookings (appointment_start);

create index if not exists bookings_status_hold_idx
  on public.bookings (status, hold_expires_at);

alter table public.bookings
  add constraint bookings_active_time_exclusion
  exclude using gist (
    tsrange(
      appointment_start at time zone 'UTC',
      (appointment_start at time zone 'UTC') + (duration_minutes * interval '1 minute'),
      '[)'
    ) with &&
  ) where (status in ('held', 'confirmed'));

alter table public.bookings enable row level security;

create or replace function public.accept_booking(
  p_booking_id uuid,
  p_duration_minutes integer
)
returns public.bookings
language plpgsql
security definer
set search_path = public
as $$
declare
  target public.bookings;
  requested_end timestamptz;
begin
  select * into target
  from public.bookings
  where id = p_booking_id
  for update;

  if not found then
    raise exception 'BOOKING_NOT_FOUND';
  end if;

  if target.status <> 'held' or target.hold_expires_at <= now() then
    raise exception 'BOOKING_HOLD_EXPIRED';
  end if;

  requested_end := target.appointment_start + make_interval(mins => p_duration_minutes);

  if exists (
    select 1
    from public.bookings existing
    where existing.id <> target.id
      and existing.status = 'confirmed'
      and tstzrange(existing.appointment_start,
        existing.appointment_start + make_interval(mins => existing.duration_minutes), '[)')
        && tstzrange(target.appointment_start, requested_end, '[)')
  ) then
    raise exception 'BOOKING_TIME_UNAVAILABLE';
  end if;

  update public.bookings
  set status = 'confirmed', duration_minutes = p_duration_minutes
  where id = target.id
  returning * into target;

  return target;
end;
$$;
