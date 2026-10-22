-- ============================================================================
-- Izzy Place Inn & Suites — Supabase schema
-- Run this in the Supabase SQL editor (or via `supabase db push`).
-- ============================================================================

-- Room categories ------------------------------------------------------------
create table if not exists public.room_categories (
  id            text primary key,
  name          text not null,
  slug          text not null unique,
  description   text not null,
  price_per_night numeric not null check (price_per_night >= 0),
  max_guests    int not null default 2,
  size_sqm      numeric not null default 0,
  amenities     text[] not null default '{}',
  images        text[] not null default '{}',
  total_rooms   int not null default 1,
  featured      boolean not null default false,
  created_at    timestamptz not null default now()
);

-- Add-on services -------------------------------------------------------------
create table if not exists public.add_on_services (
  id          text primary key,
  name        text not null,
  description text not null,
  price       numeric check (price >= 0),
  category    text not null default 'other'
    check (category in ('transport', 'dining', 'amenities', 'wellness', 'other')),
  icon        text not null default 'Sparkles',
  available   boolean not null default true
);

-- Rates are quoted by management rather than charged at booking.
alter table public.add_on_services alter column price drop not null;

-- Bookings --------------------------------------------------------------------
create table if not exists public.bookings (
  id               uuid primary key default gen_random_uuid(),
  booking_reference text not null unique,
  booking_type     text not null default 'room' check (booking_type = 'room'),
  room_category_id text references public.room_categories (id) on delete set null,
  guest_name       text not null,
  guest_email      text not null,
  guest_phone      text not null,
  check_in_date    date not null,
  check_out_date   date not null,
  number_of_guests int not null default 1,
  number_of_rooms  int not null default 1,
  add_on_services  jsonb not null default '[]'::jsonb,
  special_requests text,
  total_amount     numeric not null check (total_amount >= 0),
  payment_status   text not null default 'pending'
    check (payment_status in ('pending', 'paid', 'partially_paid', 'refunded', 'cancelled')),
  booking_status   text not null default 'confirmed'
    check (booking_status in ('pending', 'confirmed', 'checked_in', 'completed', 'cancelled', 'no_show')),
  created_at       timestamptz not null default now(),
  check (room_category_id is not null)
);

-- Availability (optional: mark booked / blocked nights per room) ----------------
create table if not exists public.availability (
  id          uuid primary key default gen_random_uuid(),
  resource_type text not null default 'room' check (resource_type = 'room'),
  resource_id text not null,
  blocked_date date not null,
  reason      text,
  created_at  timestamptz not null default now(),
  unique (resource_type, resource_id, blocked_date)
);

-- Indexes ----------------------------------------------------------------------
create index if not exists idx_bookings_email on public.bookings (guest_email);
create index if not exists idx_bookings_reference on public.bookings (booking_reference);
create index if not exists idx_bookings_dates on public.bookings (check_in_date, check_out_date);

-- Row Level Security ------------------------------------------------------------
alter table public.room_categories enable row level security;
alter table public.add_on_services enable row level security;
alter table public.bookings enable row level security;
alter table public.availability enable row level security;

-- Public catalog is readable by everyone (the website reads it).
create policy "Catalog is public read"
  on public.room_categories for select using (true);

create policy "Catalog is public read"
  on public.add_on_services for select using (true);

-- Availability is public read (blocked dates only, no guest data).
create policy "Availability public read"
  on public.availability for select using (true);

-- Anyone can create a booking (the public booking form).
create policy "Anyone can create a booking"
  on public.bookings for insert with check (true);

-- Only the owner (guest) can read/update their own booking by reference.
create policy "Owner can read own booking"
  on public.bookings for select using (
    guest_email = auth.jwt() ->> 'email'
    or exists (
      select 1 from pg_catalog.pg_roles where rolname = current_user and rolsuper
    )
  );

create policy "Owner can update own booking"
  on public.bookings for update using (
    guest_email = auth.jwt() ->> 'email'
    or exists (
      select 1 from pg_catalog.pg_roles where rolname = current_user and rolsuper
    )
  );
