create table if not exists public.business_hours (
  day_of_week smallint primary key check (day_of_week between 0 and 6),
  open_time time,
  close_time time,
  is_open boolean not null default false,
  updated_at timestamptz not null default now(),
  constraint business_hours_time_pair check ((is_open and open_time is not null and close_time is not null) or not is_open)
);

create table if not exists public.blocked_periods (
  id uuid primary key default gen_random_uuid(),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  reason text not null default '',
  created_at timestamptz not null default now(),
  constraint blocked_periods_order check (ends_at > starts_at)
);

alter table public.business_hours enable row level security;
alter table public.blocked_periods enable row level security;

grant select, insert, update, delete on table public.business_hours to service_role;
grant select, insert, update, delete on table public.blocked_periods to service_role;

insert into public.business_hours (day_of_week, open_time, close_time, is_open)
values
  (0, null, null, false),
  (1, null, null, false),
  (2, '09:00', '13:00', true),
  (3, '12:00', '17:00', true),
  (4, '12:00', '17:00', true),
  (5, '10:00', '14:00', true),
  (6, '10:00', '14:00', true)
on conflict (day_of_week) do update set
  open_time = excluded.open_time,
  close_time = excluded.close_time,
  is_open = excluded.is_open,
  updated_at = now();