import test from 'node:test';
import assert from 'node:assert/strict';
import { validateBooking } from '../lib/server/validation';
import { jsonBody, HttpError } from '../lib/server/http';
import { buildAdminEmail, buildGuestEmail, type EmailBooking } from '../lib/email-templates';
import { sendConfirmationPair, hotelRecipients } from '../lib/server/notifications';
import type { SendEmailArgs } from '../lib/base44/integrations/core';

const key = 'f3172da5-3845-4f36-8c4a-d97f3fc94139';
const day = (offset: number) => new Date(Date.now() + offset * 86400000).toISOString().slice(0, 10);
const input = () => ({ room_category_id: 'classic-room', guest_name: 'Ada Guest', guest_email: 'ADA@example.com', guest_phone: '+234 800 000 0000', check_in_date: day(2), check_out_date: day(4), number_of_guests: 2, number_of_rooms: 1, add_on_services: [] });
const booking: EmailBooking = { booking_reference: 'IZ-TEST', booking_type: 'room', resource: { name: 'Classic Room', price: 25000, unit: 'night' }, guest_name: '<img src=x onerror="alert(1)">', guest_email: 'ada@example.com', guest_phone: '+2348000000000', check_in_date: day(2), check_out_date: day(4), number_of_guests: 2, number_of_rooms: 1, add_ons: [{ name: 'Welcome <drinks>', price: null, quantity: 1 }], special_requests: '<a href="https://evil.example">Click</a>', subtotal: 50000, add_on_total: 0, total_amount: 50000, booking_status: 'confirmed', payment_status: 'pending' };

test('validation strips browser-owned price, status and recipient claims', () => {
  const result = validateBooking({ ...input(), total_amount: 1, payment_status: 'paid', booking_status: 'confirmed', recipient: 'attacker@example.com', resource: { price: 1 } }, key);
  assert.equal(result.guest_email, 'ada@example.com');
  for (const field of ['total_amount', 'payment_status', 'booking_status', 'recipient', 'resource']) assert.equal(field in result, false);
});

test('invalid dates, quantities, service IDs and duplicate services are rejected', () => {
  const bad = [ { check_in_date: '2027-02-30' }, { check_out_date: day(2) }, { check_in_date: day(-2) }, { check_out_date: day(100) }, { number_of_rooms: 0 }, { number_of_rooms: 1.5 }, { number_of_guests: 41 }, { number_of_rooms: '1' }, { add_on_services: [{ id: 'minibar', quantity: 1 }] }, { add_on_services: [{ id: 'addon-welcome-drinks', quantity: 0 }] }, { add_on_services: [{ id: 'addon-welcome-drinks', quantity: 1 }, { id: 'addon-welcome-drinks', quantity: 1 }] }, { guest_email: 'guest@example.com\r\nBcc: attacker@example.com' } ];
  for (const change of bad) assert.throws(() => validateBooking({ ...input(), ...change }, key), HttpError);
  assert.throws(() => validateBooking(input(), 'invalid-key'), HttpError);
});

test('both templates escape guest text and management rates remain unpriced', () => {
  for (const html of [buildAdminEmail(booking), buildGuestEmail(booking)]) {
    assert.ok(html.includes('&lt;img src=x onerror=&quot;alert(1)&quot;&gt;'));
    assert.ok(html.includes('Welcome &lt;drinks&gt;'));
    assert.ok(!html.includes('<img src=x'));
    assert.ok(html.includes('Rate varies. Management will confirm the price.'));
  }
  assert.ok(buildAdminEmail(booking).includes('&lt;a href=&quot;https://evil.example&quot;&gt;Click&lt;/a&gt;'));
});

test('hotel receives both configured addresses before the guest, with stable retry keys', async () => {
  const calls: SendEmailArgs[] = [];
  const events: string[] = [];
  const sender = async (message: SendEmailArgs) => { calls.push(message); events.push(calls.length === 1 ? 'hotel' : 'guest'); return { id: 'provider-id' }; };
  await sendConfirmationPair(booking, 'booking-1', false, sender, async () => { events.push('record-hotel'); });
  assert.deepEqual(events, ['hotel', 'record-hotel', 'guest']);
  assert.ok(calls[0].to.includes('izzyplaceinn@gmail.com'));
  assert.ok(calls[0].to.includes('info@izzyplaceinn.com'));
  assert.deepEqual(calls[1].to, ['ada@example.com']);
  assert.equal(calls[0].idempotencyKey, 'booking/booking-1/hotel');
  assert.equal(calls[1].idempotencyKey, 'booking/booking-1/guest');
  assert.equal(calls[0].html, buildAdminEmail(booking));
  assert.equal(new Set(hotelRecipients()).size, hotelRecipients().length);
});

test('hotel failure prevents any guest confirmation', async () => {
  let calls = 0; let marked = false;
  await assert.rejects(sendConfirmationPair(booking, 'booking-2', false, async () => { calls++; throw new Error('provider unavailable'); }, async () => { marked = true; }));
  assert.equal(calls, 1);
  assert.equal(marked, false);
});

test('failed progress persistence prevents guest send; retry resumes after recorded hotel send', async () => {
  const calls: SendEmailArgs[] = [];
  const sender = async (message: SendEmailArgs) => { calls.push(message); return { id: 'provider-id' }; };
  await assert.rejects(sendConfirmationPair(booking, 'booking-3', false, sender, async () => { throw new Error('database unavailable'); }));
  assert.equal(calls.length, 1);
  calls.length = 0;
  await sendConfirmationPair(booking, 'booking-3', true, sender, async () => { assert.fail('must not repeat progress mark'); });
  assert.equal(calls.length, 1);
  assert.deepEqual(calls[0].to, [booking.guest_email]);
});

test('JSON reader rejects oversized, malformed and foreign-origin requests', async () => {
  const request = (body: string, origin?: string) => new Request('https://izzyplaceinn.com/api/bookings', { method: 'POST', headers: { 'content-type': 'application/json', ...(origin ? { origin } : {}) }, body });
  await assert.rejects(jsonBody(request('x'.repeat(17000))), { status: 413 });
  await assert.rejects(jsonBody(request('[]')), { status: 400 });
  await assert.rejects(jsonBody(request('{')), { status: 400 });
  await assert.rejects(jsonBody(request('{}', 'https://evil.example')), { status: 403 });
  assert.deepEqual(await jsonBody(request('{"safe":true}')), { safe: true });
});

test('database-free server owns totals, capacity and deterministic pending references', async () => {
  const { buildBookingRequest } = await import('../lib/server/booking-request');
  const old = process.env.BOOKING_REFERENCE_SECRET;
  process.env.BOOKING_REFERENCE_SECRET = 'test-only-reference-secret';
  try {
    const value = validateBooking({...input(),room_category_id:'room-classic-studio',total_amount:1,payment_status:'paid'},key);
    const built = buildBookingRequest(value);
    assert.equal(built.total_amount,50000);
    assert.equal(built.booking_status,'pending');
    assert.equal(built.payment_status,'pending');
    assert.deepEqual(buildBookingRequest(value),built);
    assert.throws(()=>buildBookingRequest({...value,number_of_guests:3}),{status:400});
    assert.throws(()=>buildBookingRequest({...value,room_category_id:'forged'}),{status:400});
    delete process.env.BOOKING_REFERENCE_SECRET;
    assert.throws(()=>buildBookingRequest(value),{status:503});
  } finally {if(old===undefined)delete process.env.BOOKING_REFERENCE_SECRET;else process.env.BOOKING_REFERENCE_SECRET=old;}
});

test('bot protection fails closed and rejects a valid token for another hostname/action', async () => {
  const { verifyBotCheck } = await import('../lib/server/bot-check');
  const old = process.env.TURNSTILE_SECRET_KEY;
  const origin = process.env.SITE_ORIGIN;
  const originalFetch = globalThis.fetch;
  try {
    delete process.env.TURNSTILE_SECRET_KEY;
    await assert.rejects(verifyBotCheck('token','booking'),{status:503});
    process.env.TURNSTILE_SECRET_KEY='server-test-secret'; process.env.SITE_ORIGIN='https://izzyplaceinn.com';
    for (const response of [{success:false},{success:true,hostname:'attacker.example',action:'booking'},{success:true,hostname:'izzyplaceinn.com',action:'contact'}]) {
      globalThis.fetch=async()=>Response.json(response);
      await assert.rejects(verifyBotCheck('token','booking'),{status:400});
    }
    globalThis.fetch=async()=>Response.json({success:true,hostname:'izzyplaceinn.com',action:'booking'});
    await verifyBotCheck('token','booking');
  } finally {globalThis.fetch=originalFetch; if(old===undefined)delete process.env.TURNSTILE_SECRET_KEY;else process.env.TURNSTILE_SECRET_KEY=old; if(origin===undefined)delete process.env.SITE_ORIGIN;else process.env.SITE_ORIGIN=origin;}
});
