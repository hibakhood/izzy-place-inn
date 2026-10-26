-- Apply after schema.sql and seed.sql. Server-only booking creation and outbox.
begin;
alter table public.add_on_services alter column price drop not null;
-- Keep the authoritative server catalog aligned with the published room rates.
update public.room_categories set price_per_night=25000, name='Classic' where id='room-classic-studio';
update public.room_categories set price_per_night=35000, name='Deluxe' where id='room-luxury';
update public.room_categories set price_per_night=45000, name='Executive Suite' where id='room-classic-suite';
update public.room_categories set price_per_night=55000, name='Family' where id='room-presidential-suite-2-bed';
update public.add_on_services set price=null where id in ('addon-airport-transfer','addon-welcome-drinks','addon-early-checkin','addon-late-checkout');
create index if not exists idx_bookings_active_inventory on public.bookings (room_category_id, check_in_date, check_out_date) where booking_status in ('pending','confirmed','checked_in');

revoke insert, update, delete on public.bookings from anon, authenticated;
drop policy if exists "Anyone can create a booking" on public.bookings;
drop policy if exists "Owner can update own booking" on public.bookings;
alter table public.bookings add column if not exists request_key uuid unique;
alter table public.bookings add column if not exists request_fingerprint text;
-- NOT VALID preserves old records, while enforcing safe values for new writes.
alter table public.bookings drop constraint if exists safe_booking_dates;
alter table public.bookings add constraint safe_booking_dates check (check_out_date > check_in_date and check_out_date - check_in_date <= 90) not valid;
alter table public.bookings drop constraint if exists safe_booking_quantities;
alter table public.bookings add constraint safe_booking_quantities check (number_of_rooms between 1 and 20 and number_of_guests between 1 and 40) not valid;

create table if not exists public.booking_notifications (
  booking_id uuid primary key references public.bookings(id),
  payload jsonb not null,
  hotel_sent_at timestamptz,
  guest_sent_at timestamptz,
  lease_until timestamptz,
  claim_token uuid,
  attempts int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.booking_notifications enable row level security;
revoke all on public.booking_notifications from anon, authenticated;
grant all on public.booking_notifications to service_role;

create table if not exists public.public_rate_limits (
  key text primary key,
  window_start timestamptz not null,
  count int not null
);
alter table public.public_rate_limits enable row level security;
revoke all on public.public_rate_limits from anon, authenticated;
create or replace function public.consume_public_rate_limit(p_key text, p_limit int)
returns boolean language plpgsql security definer set search_path = '' as $$
declare n int;
begin
  insert into public.public_rate_limits as r(key, window_start, count) values(p_key, now(), 1)
  on conflict(key) do update set
    count = case when r.window_start < now() - interval '15 minutes' then 1 else r.count + 1 end,
    window_start = case when r.window_start < now() - interval '15 minutes' then now() else r.window_start end
  returning count into n;
  return n <= p_limit;
end $$;
revoke all on function public.consume_public_rate_limit(text,int) from public, anon, authenticated;
grant execute on function public.consume_public_rate_limit(text,int) to service_role;

create or replace function public.create_validated_booking(p_input jsonb, p_fingerprint text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  b public.bookings;
  room public.room_categories;
  start_date date := (p_input->>'check_in_date')::date;
  end_date date := (p_input->>'check_out_date')::date;
  units int := (p_input->>'number_of_rooms')::int;
  guests int := (p_input->>'number_of_guests')::int;
  busy int;
  selected jsonb;
  email_data jsonb;
begin
  -- Serialize the same request key even when the selected category differs.
  perform pg_advisory_xact_lock(hashtextextended(p_input->>'request_key', 0));
  select * into b from public.bookings where request_key = (p_input->>'request_key')::uuid;
  if found then
    if b.request_fingerprint is distinct from p_fingerprint then raise exception 'REQUEST_CHANGED'; end if;
    return jsonb_build_object('id', b.id, 'booking_reference', b.booking_reference, 'total_amount', b.total_amount);
  end if;
  select * into room from public.room_categories where id = p_input->>'room_category_id' for update;
  if not found then raise exception 'ROOM_UNAVAILABLE'; end if;
  if start_date < (now() at time zone 'Africa/Lagos')::date or end_date <= start_date or end_date-start_date > 90
     or units < 1 or units > 20 or guests < 1 or guests > room.max_guests * units then raise exception 'INVALID_BOOKING'; end if;
  if exists(select 1 from public.availability where resource_id=room.id and blocked_date>=start_date and blocked_date<end_date)
    then raise exception 'ROOM_UNAVAILABLE'; end if;
  -- Check each night: summing all overlapping reservations overcounts disjoint stays.
  select coalesce(max(used),0) into busy from (
    select d.day, coalesce(sum(existing.number_of_rooms),0)::int used
    from generate_series(start_date, end_date-1, interval '1 day') d(day)
    left join public.bookings existing on existing.room_category_id=room.id
      and existing.booking_status in ('pending','confirmed','checked_in')
      and existing.check_in_date<=d.day::date and existing.check_out_date>d.day::date
    group by d.day
  ) nights;
  if busy + units > room.total_rooms then raise exception 'ROOM_UNAVAILABLE'; end if;
  if jsonb_typeof(p_input->'add_on_services') <> 'array' or jsonb_array_length(p_input->'add_on_services')>4 then raise exception 'INVALID_BOOKING'; end if;
  if exists(select 1 from jsonb_array_elements(p_input->'add_on_services') a
    where a->>'id' not in ('addon-airport-transfer','addon-welcome-drinks','addon-early-checkin','addon-late-checkout')
      or (a->>'quantity')::int not between 1 and 20
      or not exists(select 1 from public.add_on_services s where s.id=a->>'id' and s.available)) then raise exception 'INVALID_BOOKING'; end if;
  insert into public.bookings(request_key, request_fingerprint, booking_reference, room_category_id, guest_name, guest_email, guest_phone,
    check_in_date,check_out_date,number_of_guests,number_of_rooms,add_on_services,special_requests,total_amount,payment_status,booking_status)
  values((p_input->>'request_key')::uuid,p_fingerprint,'IZ-'||upper(substr(replace(gen_random_uuid()::text,'-',''),1,16)),room.id,
    p_input->>'guest_name',p_input->>'guest_email',p_input->>'guest_phone',start_date,end_date,guests,units,
    p_input->'add_on_services',p_input->>'special_requests',room.price_per_night*(end_date-start_date)*units,'pending','confirmed') returning * into b;
  select coalesce(jsonb_agg(jsonb_build_object('name',s.name,'price',null,'quantity',(a->>'quantity')::int)),'[]'::jsonb) into selected
    from jsonb_array_elements(b.add_on_services) a join public.add_on_services s on s.id=a->>'id';
  email_data := to_jsonb(b) || jsonb_build_object('resource',jsonb_build_object('name',room.name,'price',room.price_per_night,'unit','night'),
    'subtotal',b.total_amount,'add_on_total',0,'add_ons',selected);
  insert into public.booking_notifications(booking_id,payload) values(b.id,email_data);
  return jsonb_build_object('id',b.id,'booking_reference',b.booking_reference,'total_amount',b.total_amount);
end $$;
revoke all on function public.create_validated_booking(jsonb,text) from public,anon,authenticated;
grant execute on function public.create_validated_booking(jsonb,text) to service_role;

create or replace function public.claim_booking_notification(p_booking_id uuid, p_token uuid)
returns setof public.booking_notifications language sql security definer set search_path = '' as $$
  update public.booking_notifications set lease_until=now()+interval '5 minutes',claim_token=p_token,attempts=attempts+1
  where booking_id=p_booking_id and guest_sent_at is null and (lease_until is null or lease_until<now())
    and created_at>now()-interval '23 hours' and attempts<30
  returning *;
$$;
revoke all on function public.claim_booking_notification(uuid,uuid) from public,anon,authenticated;
grant execute on function public.claim_booking_notification(uuid,uuid) to service_role;
commit;
