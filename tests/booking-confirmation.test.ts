import test from 'node:test';
import assert from 'node:assert/strict';
import { bookingConfirmationText } from '../src/lib/booking-confirmation';

const booking = { room_category_id: 'family-room', guest_name: 'Ada Guest', guest_email: 'ada@example.com', guest_phone: '08000000000', check_in_date: '2026-12-01', check_out_date: '2026-12-03', number_of_guests: 2, number_of_rooms: 1, add_on_services: [], special_requests: 'Quiet room please' };
test('download includes booking details and pending status without optional extras', () => {
  const text = bookingConfirmationText(booking, 'IZ-EXAMPLE', 'Family Room', 110000, [], 'Reception');
  for (const value of ['IZ-EXAMPLE', booking.guest_email, booking.check_in_date, booking.check_out_date, 'Family Room', '110,000', 'None requested', 'Quiet room please', 'not a payment receipt or a confirmed reservation']) assert.ok(text.includes(value));
});
test('download includes selected extras and management pricing notice', () => {
  const text = bookingConfirmationText(booking, 'IZ-EXAMPLE', 'Family Room', 110000, ['Welcome Drinks x 2'], 'Reception');
  assert.ok(text.includes('Welcome Drinks x 2'));
  assert.ok(text.includes('not included in the room total'));
  assert.ok(!text.includes('None requested'));
});
