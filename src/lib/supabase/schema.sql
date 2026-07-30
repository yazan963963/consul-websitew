-- CONSUL — Supabase schema
-- Run this once in the Supabase SQL editor after creating your project.
-- Storage buckets ("catalog-images", "catalog-covers", "catalog-pdfs")
-- must be created separately from the Storage tab (see DEPLOYMENT.md).

create extension if not exists "uuid-ossp";

create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name_ar text not null,
  name_en text not null,
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
  featured boolean default false,
  is_new boolean default false,
  best_seller boolean default false,
  sort_order int default 0,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

create table if not exists catalog_images (
  id uuid primary key default uuid_generate_v4(),
  catalog_id uuid references catalogs(id) on delete cascade,
  url text not null,
  width int,
  height int,
  alt text,
  sort_order int default 0
);

-- Row Level Security: public can read, only authenticated admin can write
alter table categories enable row level security;
alter table catalogs enable row level security;
alter table catalog_images enable row level security;

create policy "Public read categories" on categories for select using (true);
create policy "Public read catalogs" on catalogs for select using (true);
create policy "Public read catalog_images" on catalog_images for select using (true);

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
