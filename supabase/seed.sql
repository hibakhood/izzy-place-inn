-- ============================================================================
-- Izzy Place Inn & Suites. seed data
-- Mirrors the fallback catalog in src/data/*.ts. Run AFTER schema.sql.
-- ============================================================================

-- Room categories --------------------------------------------------------------
insert into public.room_categories
  (id, name, slug, description, price_per_night, max_guests, size_sqm, amenities, images, total_rooms, featured)
values
  (
    'room-classic-studio', 'Classic Room', 'classic-room',
    'A comfortable room with a kitchenette, a work desk and space to relax. A good choice for a short visit or a longer stay.',
    25000, 2, 24,
    array['Full size bathroom','Refrigerator','Air conditioning','Smart TV with international channels','Free high speed Wi-Fi','Regular electricity with generator and inverter backup','Kitchenette','Work desk','Rain shower','Tea & coffee station'],
    array['/images/rooms/classic-room-view-4.jpg','/images/rooms/classic-room-view-2.jpg','/images/rooms/classic-room-view-3.jpg','/images/rooms/classic-room.jpg','/images/rooms/classic-kitchen.jpg','/images/rooms/classic-bathroom.jpg','/images/rooms/classic-toilet.jpg'],
    8, false
  ),
  (
    'room-luxury', 'Deluxe Room', 'deluxe-room',
    'A spacious room with a kitchenette and private bathroom. Suitable for business trips and holidays.',
    35000, 2, 30,
    array['Full size bathroom','Refrigerator','Air conditioning','Smart TV with international channels','Free high speed Wi-Fi','Regular electricity with generator and inverter backup','Kitchenette','Executive work desk','Rain shower','Tea & coffee station','Mini fridge'],
    array['/images/rooms/deluxe-view-3.jpg','/images/rooms/deluxe-view-1.jpg','/images/rooms/delux-kitchen.jpg','/images/rooms/deluxe-kitchen.jpg','/images/rooms/deluxe-bathroom.jpg'],
    10, false
  ),
  (
    'room-classic-suite', 'Executive Suite', 'executive-suite',
    'A spacious suite with a full kitchen and a separate living area. There is room to work, relax or spend time with visitors.',
    45000, 2, 52,
    array['Full size bathroom','Refrigerator','Air conditioning','Smart TV with international channels','Free high speed Wi-Fi','Regular electricity with generator and inverter backup','Full kitchen','Separate living area','Executive work desk','Bathtub & rain shower','Mini fridge'],
    array['/images/rooms/executive-suite-view-3.jpg','/images/rooms/executive-suite-view-2.jpg','/images/rooms/executive-suite-view.jpg','/images/rooms/executive-suite-kitchen-2.jpg','/images/rooms/executive-bathroom.jpg','/images/rooms/executive-bathroom-2.jpg','/images/rooms/executive-suite-toilet.jpg'],
    6, false
  ),
  (
    'room-presidential-suite-2-bed', 'Family Room', 'family-room',
    'A bedroom, living area and full kitchen give your family space to spend time together.',
    55000, 4, 100,
    array['Full size bathroom','Refrigerator','Air conditioning','Smart TV with international channels','Free high speed Wi-Fi','Regular electricity with generator and inverter backup','Full kitchen','Living & Bedroom','Airport transfer','Late checkout'],
    array['/images/rooms/family-bedroom.jpg','/images/rooms/family-living-room-2.jpg','/images/rooms/family-living-room.jpg','/images/rooms/family-kitchen.jpg','/images/rooms/family-kitchen-2.jpg','/images/rooms/family-bathroom.jpg'],
    1, true
  );

-- Add-on services ----------------------------------------------------------------
insert into public.add_on_services (id, name, description, price, category, icon, available)
values
  ('addon-airport-transfer', 'Airport Transfer', 'Arrange a pickup or drop-off at Ibadan Airport.', null, 'transport', 'Plane', true),
  ('addon-welcome-drinks', 'Welcome Drinks', 'Request a welcome drink when you arrive.', null, 'dining', 'GlassWater', true),
  ('addon-early-checkin', 'Early Check-in', 'Request an earlier arrival time. Subject to availability and confirmation by management.', null, 'amenities', 'Clock', true),
  ('addon-late-checkout', 'Late Checkout', 'Request a later departure time. Subject to availability and confirmation by management.', null, 'amenities', 'Moon', true);
