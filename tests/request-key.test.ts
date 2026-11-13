import test from 'node:test';
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import { createRequestKey, isRequestKey } from '../src/lib/request-key';

test('booking supports mobile browsers without randomUUID using secure random bytes', () => {
  const legacyCrypto = { getRandomValues: webcrypto.getRandomValues.bind(webcrypto) } as Pick<Crypto, 'getRandomValues'>;
  const keys = Array.from({ length: 50 }, () => createRequestKey(legacyCrypto));
  assert.ok(keys.every(isRequestKey));
  assert.equal(new Set(keys).size, keys.length);
});
test('malformed stored retry keys are rejected', () => {
  for (const value of ['', 'invalid', undefined, '12345678-1234-1234-1234-123456789012']) assert.equal(isRequestKey(value), false);
});
