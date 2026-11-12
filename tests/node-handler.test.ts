import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { nodeHandler } from '../lib/server/node-handler';
import { jsonBody } from '../lib/server/http';

async function invoke(body: unknown, parsed: boolean) {
  const req = Object.assign(Readable.from(parsed ? [] : [JSON.stringify(body)]), {
    method: 'POST', url: '/api/bookings', headers: { 'content-type': 'application/json', origin: 'https://www.izzyplaceinn.com' },
    ...(parsed ? { body } : {}),
  }) as IncomingMessage & { body?: unknown };
  let status = 0; let result = '';
  const res = { writeHead(code: number) { status = code; }, end(value: Buffer) { result = value.toString(); } } as unknown as ServerResponse;
  await nodeHandler(async request => Response.json(await jsonBody(request)))(req, res);
  return { status, data: JSON.parse(result) };
}

test('Node API adapter handles Vercel parsed bodies and raw request streams', async () => {
  for (const parsed of [true, false]) {
    const result = await invoke({ safe: 'value' }, parsed);
    assert.equal(result.status, 200);
    assert.deepEqual(result.data, { safe: 'value' });
  }
});
test('Node API adapter returns structured errors for oversized requests', async () => {
  const result = await invoke({ large: 'x'.repeat(17000) }, true);
  assert.equal(result.status, 413);
  assert.equal(result.data.ok, false);
});
