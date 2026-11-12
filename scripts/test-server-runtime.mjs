import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const output = await mkdtemp(join(tmpdir(), 'izzy-server-runtime-'));
try {
  execFileSync(process.execPath, ['node_modules/typescript/bin/tsc', '-p', 'tsconfig.server.json', '--outDir', output], { stdio: 'inherit' });
  await writeFile(join(output, 'package.json'), JSON.stringify({ type: 'module' }));
  await writeFile(join(output, 'verify.mjs'), `
    import assert from 'node:assert/strict';
    import handler, { POST } from './api/bookings.js';
    import contact from './api/contact.js';
    import retired from './api/send-booking-emails.js';
    assert.equal(typeof handler, 'function');
    assert.equal(typeof contact, 'function');
    assert.equal(typeof retired, 'function');
    const result = await POST(new Request('https://www.izzyplaceinn.com/api/bookings'));
    assert.equal(result.status, 405);
    process.env.RESEND_API_KEY = 'test-only';
    process.env.RESEND_FROM_EMAIL = 'info@izzyplaceinn.com';
    process.env.RATE_LIMIT_SECRET = 'test-only-rate';
    process.env.BOOKING_REFERENCE_SECRET = 'test-only-reference';
    process.env.SITE_ORIGIN = 'https://izzyplaceinn.com';
    const messages = [];
    globalThis.fetch = async (url, options) => {
      assert.equal(url, 'https://api.resend.com/emails');
      messages.push(JSON.parse(options.body));
      return Response.json({ id: 'test-email-id' });
    };
    const day = offset => new Date(Date.now() + offset * 86400000).toISOString().slice(0, 10);
    for (const add_on_services of [[], [{ id: 'addon-welcome-drinks', quantity: 1 }]]) {
      const response = await POST(new Request('https://www.izzyplaceinn.com/api/bookings', {
        method: 'POST',
        headers: { 'content-type': 'application/json', origin: 'https://www.izzyplaceinn.com', 'idempotency-key': 'f3172da5-3845-4f36-8c4a-d97f3fc94139' },
        body: JSON.stringify({ room_category_id: 'room-classic-studio', guest_name: 'Test Guest', guest_email: 'guest@example.com', guest_phone: '08000000000', check_in_date: day(2), check_out_date: day(4), number_of_guests: 2, number_of_rooms: 1, add_on_services }),
      }));
      assert.equal(response.status, 200, JSON.stringify(await response.clone().json()));
      const confirmation = await response.json();
      assert.equal(confirmation.ok, true);
      assert.match(confirmation.booking_reference, /^IZ-/);
      assert.equal(confirmation.total_amount, 50000);
    }
    assert.equal(messages.length, 2);
    for (const message of messages) {
      assert.deepEqual(message.to, ['info@izzyplaceinn.com']);
      assert.ok(message.html.includes('guest@example.com'));
    }
    console.log('Compiled Node ESM API imports and booking/email flow passed (email delivery mocked).');
  `);
  execFileSync(process.execPath, [join(output, 'verify.mjs')], { stdio: 'inherit' });
} finally {
  await rm(output, { recursive: true, force: true });
}
