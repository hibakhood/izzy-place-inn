import test from 'node:test';
import assert from 'node:assert/strict';
import { validateBooking } from '../lib/server/validation';
import { jsonBody, HttpError } from '../lib/server/http';
import { buildAdminEmail, buildGuestEmail, type EmailBooking } from '../lib/email-templates';
import { sendHotelBooking, hotelRecipients } from '../lib/server/notifications';
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

test('only info inbox receives booking email, with a stable retry key', async () => {
  const calls: SendEmailArgs[] = [];
  await sendHotelBooking(booking, 'booking-1', async message => { calls.push(message); return { id: 'provider-id' }; });
  assert.equal(calls.length, 1);
  assert.deepEqual(calls[0].to, ['info@izzyplaceinn.com']);
  assert.equal(calls[0].idempotencyKey, 'booking/booking-1/hotel');
  assert.equal(calls[0].html, buildAdminEmail(booking));
  assert.ok(calls[0].html.includes(booking.guest_email));
});

test('hotel email failure prevents a successful booking response', async () => {
  await assert.rejects(sendHotelBooking(booking, 'booking-2', async () => { throw new Error('provider unavailable'); }));
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
    globalThis.fetch=async()=>Response.json({success:true,hostname:'www.izzyplaceinn.com',action:'contact'});
    await verifyBotCheck('token','contact');
  } finally {globalThis.fetch=originalFetch; if(old===undefined)delete process.env.TURNSTILE_SECRET_KEY;else process.env.TURNSTILE_SECRET_KEY=old; if(origin===undefined)delete process.env.SITE_ORIGIN;else process.env.SITE_ORIGIN=origin;}
});


test('booking accepts no extras and each available optional extra', () => {
  assert.deepEqual(validateBooking(input(), key).add_on_services, []);
  for (const id of ['addon-airport-transfer', 'addon-welcome-drinks', 'addon-early-checkin', 'addon-late-checkout']) {
    const selection = [{ id, quantity: 1 }];
    assert.deepEqual(validateBooking({ ...input(), add_on_services: selection }, key).add_on_services, selection);
  }
});


test('guest email remains required for hotel booking details', () => {
  for (const guest_email of ['', undefined, 'invalid']) {
    assert.throws(() => validateBooking({ ...input(), guest_email }, key), HttpError);
  }
  assert.equal(validateBooking(input(), key).guest_email, 'ada@example.com');
});

test('booking succeeds without a security token and sends only the hotel email', async () => {
  const { POST } = await import('../api/bookings');
  const keys = ['RESEND_API_KEY', 'RESEND_FROM_EMAIL', 'RATE_LIMIT_SECRET', 'BOOKING_REFERENCE_SECRET', 'SITE_ORIGIN'];
  const saved = keys.map(key => process.env[key]);
  const originalFetch = globalThis.fetch;
  const messages: Record<string, unknown>[] = [];
  try {
    Object.assign(process.env, { RESEND_API_KEY: 'test-only', RESEND_FROM_EMAIL: 'info@izzyplaceinn.com', RATE_LIMIT_SECRET: 'test-rate-limit', BOOKING_REFERENCE_SECRET: 'test-reference', SITE_ORIGIN: 'https://izzyplaceinn.com' });
    globalThis.fetch = async (url, options) => {
      assert.equal(url, 'https://api.resend.com/emails');
      messages.push(JSON.parse(String(options?.body)));
      return new Response(JSON.stringify({ id: 'mock-email-id' }), { status: 200 });
    };
    for (const extras of [[], [{ id: 'addon-welcome-drinks', quantity: 1 }]]) {
      const response = await POST(new Request('https://izzyplaceinn.com/api/bookings', {
        method: 'POST', headers: { 'content-type': 'application/json', origin: 'https://izzyplaceinn.com', 'idempotency-key': key },
        body: JSON.stringify({ ...input(), room_category_id: "room-classic-studio", add_on_services: extras }),
      }));
      assert.equal(response.status, 200);
      assert.equal((await response.json()).ok, true);
    }
    assert.equal(messages.length, 2);
    for (const message of messages) {
      assert.deepEqual(message.to, ['info@izzyplaceinn.com']);
      assert.ok(String(message.html).includes('ada@example.com'));
    }
  } finally {
    globalThis.fetch = originalFetch;
    keys.forEach((key, index) => { if (saved[index] === undefined) delete process.env[key]; else process.env[key] = saved[index]; });
  }
});

test('origin checks accept hotel aliases and exact deployment hosts without trusting arbitrary sites', async () => {
  const names = ['SITE_ORIGIN', 'VERCEL', 'VERCEL_URL', 'VERCEL_BRANCH_URL', 'VERCEL_PROJECT_PRODUCTION_URL', 'NODE_ENV'];
  const saved = names.map(name => process.env[name]);
  const request = (origin: string) => new Request('https://www.izzyplaceinn.com/api/bookings', { method: 'POST', headers: { 'content-type': 'application/json', origin, host: 'attacker.example', 'x-forwarded-host': 'attacker.example' }, body: '{}' });
  try {
    Object.assign(process.env, { NODE_ENV: 'production', SITE_ORIGIN: ' https://www.izzyplaceinn.com/ ', VERCEL: '1', VERCEL_URL: 'izzy-test-deploy.vercel.app', VERCEL_BRANCH_URL: 'izzy-test-branch.vercel.app' });
    for (const origin of ['https://izzyplaceinn.com', 'https://www.izzyplaceinn.com', 'https://izzy-test-deploy.vercel.app', 'https://izzy-test-branch.vercel.app']) {
      assert.deepEqual(await jsonBody(request(origin)), {});
    }
    for (const origin of ['https://attacker.example', 'https://unrelated.vercel.app', 'https://www.izzyplaceinn.com.attacker.example', 'http://www.izzyplaceinn.com', 'null', 'http://localhost:5174']) {
      await assert.rejects(jsonBody(request(origin)), { status: 403 });
    }
    process.env.SITE_ORIGIN = 'invalid';
    assert.deepEqual(await jsonBody(request('https://www.izzyplaceinn.com')), {});
  } finally {
    names.forEach((name, index) => { if (saved[index] === undefined) delete process.env[name]; else process.env[name] = saved[index]; });
  }
});

test('booking CORS permits only trusted origins and required request headers', async () => {
  const { OPTIONS, POST } = await import('../api/bookings');
  const preflight = (origin: string, headers = 'content-type,idempotency-key') => new Request('https://www.izzyplaceinn.com/api/bookings', { method: 'OPTIONS', headers: { origin, 'access-control-request-method': 'POST', 'access-control-request-headers': headers } });
  const accepted = await OPTIONS(preflight('https://izzyplaceinn.com'));
  assert.equal(accepted.status, 204);
  assert.equal(accepted.headers.get('access-control-allow-origin'), 'https://izzyplaceinn.com');
  assert.equal(accepted.headers.get('access-control-allow-credentials'), null);
  for (const origin of ['null', 'https://attacker.example', 'https://izzyplaceinn.com.attacker.example']) {
    const rejected = await OPTIONS(preflight(origin));
    assert.equal(rejected.status, 403);
    assert.equal(rejected.headers.get('access-control-allow-origin'), null);
  }
  assert.equal((await OPTIONS(preflight('https://izzyplaceinn.com', 'authorization'))).status, 403);
  const invalidBooking = await POST(new Request('https://www.izzyplaceinn.com/api/bookings', { method: 'POST', headers: { origin: 'https://izzyplaceinn.com', 'content-type': 'application/json' }, body: '{}' }));
  assert.equal(invalidBooking.status, 400);
  assert.equal(invalidBooking.headers.get('access-control-allow-origin'), 'https://izzyplaceinn.com');
});
