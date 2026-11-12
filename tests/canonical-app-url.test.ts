import test from 'node:test';
import assert from 'node:assert/strict';
import { canonicalAppUrl } from '../src/lib/canonical-app-url';

test('installed apex app navigates to www before sending booking data', () => {
  assert.equal(canonicalAppUrl('https://izzyplaceinn.com/booking?slug=family-room#/booking'), 'https://www.izzyplaceinn.com/booking?slug=family-room#/booking');
});
test('canonical navigation does not redirect other hosts, localhost or insecure URLs', () => {
  for (const url of ['https://www.izzyplaceinn.com/booking', 'https://other.vercel.app/booking', 'http://127.0.0.1:5174/booking', 'http://izzyplaceinn.com/booking', 'https://izzyplaceinn.com.attacker.example/booking']) assert.equal(canonicalAppUrl(url), null);
});
