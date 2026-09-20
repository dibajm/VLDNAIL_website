create table if not exists public.catalog_items (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('service', 'tier', 'extra')),
  slug text not null unique,
  label text not null,
  description text not null default '',
  new_set_price numeric(10, 2),
  fill_price numeric(10, 2),
  price_min numeric(10, 2),
  price_max numeric(10, 2),
  duration_minutes integer check (duration_minutes is null or duration_minutes > 0),
  active boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create index if not exists catalog_items_category_order_idx
  on public.catalog_items (category, sort_order);

alter table public.catalog_items enable row level security;

grant select, insert, update, delete on table public.catalog_items to service_role;

insert into public.catalog_items (category, slug, label, description, new_set_price, fill_price, sort_order)
values
  ('service', 'shellac', 'Shellac', 'Classic gel polish finish', 40, null, 10),
  ('service', 'overlay', 'Overlay', 'Strength & shine, no extensions', 55, 45, 20),
  ('service', 'gel-x', 'Gel X', 'Gel extensions with a lightweight finish', 55, 45, 30),
  ('service', 'short', 'Short', 'Acrylic / Polygel / Hard Gel', 60, 50, 40),
  ('service', 'medium', 'Medium', 'Acrylic / Polygel / Hard Gel', 70, 60, 50),
  ('service', 'long', 'Long', 'Acrylic / Polygel / Hard Gel', 80, 70, 60),
  ('service', 'xl', 'XL', 'Acrylic / Polygel / Hard Gel', 90, 80, 70),
  ('service', 'press-ons', 'Press-ons', 'Custom handmade - contact for pricing', null, null, 80),
  ('tier', 'tier-1', 'Tier 1', 'French, Solid Colour, Chrome, Cateye, Simple Aura, Basic Nail Art', null, null, 10),
  ('tier', 'tier-2', 'Tier 2', 'French Designs, Blooming Gel, Plaid, Rhinestone Accents, Medium Designs', null, null, 20),
  ('tier', 'tier-3', 'Tier 3', 'Multi-Art, Layered Designs, Detailed Designs', null, null, 30),
  ('tier', 'tier-4', 'Tier 4', 'Complex Nail Art, Full Bling, 3D Characters', null, null, 40)
on conflict (slug) do nothing;