import test from 'node:test';
import assert from 'node:assert/strict';
import { saveBooking } from '../src/lib/booking';

const payload = { room_category_id: 'room-classic-studio', guest_name: 'Test Guest', guest_email: 'guest@example.com', guest_phone: '08000000000', check_in_date: '2026-12-15', check_out_date: '2026-12-16', number_of_rooms: 1, number_of_guests: 1, add_on_services: [] };
test('mobile apex booking avoids redirects and sends no browser credentials', async () => {
  const originalFetch = globalThis.fetch;
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  try {
    Object.defineProperty(globalThis, 'window', { configurable: true, value: { location: { origin: 'https://izzyplaceinn.com' } } });
    globalThis.fetch = async (url, options) => {
      assert.equal(url, 'https://www.izzyplaceinn.com/api/bookings');
      assert.equal(options?.redirect, 'error');
      assert.equal(options?.credentials, 'omit');
      assert.ok(options?.signal);
      assert.deepEqual(JSON.parse(String(options?.body)), payload);
      return Response.json({ ok: true, booking_reference: 'IZ-TEST', total_amount: 25000 });
    };
    assert.deepEqual(await saveBooking(payload, 'test-key'), { ok: true, booking_reference: 'IZ-TEST', total_amount: 25000 });
    globalThis.fetch = async () => new Response('server error', { status: 500 });
    assert.equal((await saveBooking(payload, 'test-key')).ok, false);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalWindow) Object.defineProperty(globalThis, 'window', originalWindow); else Reflect.deleteProperty(globalThis, 'window');
  }
});
