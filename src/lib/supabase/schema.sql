-- CONSUL — Supabase schema
-- Run this once in the Supabase SQL editor after creating your project.
-- Storage buckets ("catalog-images", "catalog-covers", "catalog-pdfs")
-- must be created separately from the Storage tab (see DEPLOYMENT.md).

create extension if not exists "uuid-ossp";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'viewer' check (role in ('admin', 'editor', 'viewer')),
  active boolean not null default true,
  created_at timestamptz default now()
);

create table if not exists site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name_ar text not null,
  name_en text not null,
  created_at timestamptz default now()
);

create table if not exists warehouses (
  id uuid primary key default uuid_generate_v4(), slug text unique not null,
  name_ar text not null, name_en text not null, city_ar text not null, city_en text not null,
  description_ar text, description_en text, sort_order int default 0, active boolean default true,
  created_at timestamptz default now()
);

create table if not exists catalogs (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name_ar text not null,
  name_en text not null,
  category_id uuid references categories(id) on delete set null,
  cover_url text,
  pdf_url text,
  product_count int default 0,
  colors text[] not null default '{}',
  featured boolean default false,
  is_new boolean default false,
  best_seller boolean default false,
  sort_order int default 0,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

alter table catalogs add column if not exists colors text[] not null default '{}';

create table if not exists catalog_images (
  id uuid primary key default uuid_generate_v4(),
  catalog_id uuid references catalogs(id) on delete cascade,
  url text not null,
  width int,
  height int,
  alt text,
  sort_order int default 0
);

create table if not exists catalog_warehouses (
  catalog_id uuid references catalogs(id) on delete cascade,
  warehouse_id uuid references warehouses(id) on delete cascade,
  primary key (catalog_id, warehouse_id)
);

insert into warehouses (slug, name_ar, name_en, city_ar, city_en, description_ar, description_en, sort_order)
values
  ('makkah', 'مستودع مكة', 'Makkah Warehouse', 'مكة المكرمة', 'Makkah', 'كتالوجات ومجموعات مستودع مكة.', 'Catalogs and collections available in Makkah.', 0),
  ('jeddah', 'مستودع جدة', 'Jeddah Warehouse', 'جدة', 'Jeddah', 'كتالوجات ومجموعات مستودع جدة.', 'Catalogs and collections available in Jeddah.', 1),
  ('madinah', 'مستودع المدينة', 'Madinah Warehouse', 'المدينة المنورة', 'Madinah', 'كتالوجات ومجموعات مستودع المدينة.', 'Catalogs and collections available in Madinah.', 2)
on conflict (slug) do update set name_ar=excluded.name_ar, name_en=excluded.name_en, city_ar=excluded.city_ar, city_en=excluded.city_en, sort_order=excluded.sort_order;

-- Preserve existing content during migration: every current catalog starts in all warehouses.
insert into catalog_warehouses (catalog_id, warehouse_id)
select catalogs.id, warehouses.id from catalogs cross join warehouses
on conflict do nothing;

-- Row Level Security: public can read, only authenticated admin can write
alter table categories enable row level security;
alter table catalogs enable row level security;
alter table catalog_images enable row level security;
alter table profiles enable row level security;
alter table site_settings enable row level security;
alter table warehouses enable row level security;
alter table catalog_warehouses enable row level security;

create policy "Public read categories" on categories for select using (true);
create policy "Public read catalogs" on catalogs for select using (true);
create policy "Public read catalog_images" on catalog_images for select using (true);
create policy "Public read warehouses" on warehouses for select using (active = true);
create policy "Public read catalog warehouses" on catalog_warehouses for select using (true);
create policy "Users read own profile" on profiles for select using (auth.uid() = id);
-- Administrative profile/settings writes are performed only by protected
-- Server Actions through the service-role client (which bypasses RLS).

create policy "Authenticated write categories" on categories for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated write catalogs" on catalogs for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated write catalog_images" on catalog_images for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Keep updated_at fresh
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger catalogs_set_updated_at
before update on catalogs
for each row execute procedure set_updated_at();
