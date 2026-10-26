import { createServer as createHttpServer } from 'node:http';
import { createServer, loadEnv } from 'vite';
import { POST as bookings } from '../api/bookings';
import { POST as contact } from '../api/contact';
import { POST as retry } from '../api/send-booking-emails';
Object.assign(process.env, loadEnv('development', process.cwd(), ''));
const handlers: Record<string, (request: Request) => Promise<Response>> = {
  '/api/bookings': bookings, '/api/contact': contact, '/api/send-booking-emails': retry,
};
const api = createHttpServer(async (req, res) => {
  const handler = handlers[(req.url || '').split('?')[0]];
  if (!handler) { res.writeHead(404); res.end(); return; }
  try {
    const chunks: Buffer[] = []; let size = 0;
    for await (const chunk of req) {
      size += chunk.length;
      if (size > 16384) { res.writeHead(413, {'Content-Type':'application/json'}); res.end(JSON.stringify({error:'Your request is too long.'})); return; }
      chunks.push(chunk);
    }
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) if (value) headers.set(key, Array.isArray(value) ? value.join(',') : value);
    headers.set('x-real-ip', req.socket.remoteAddress || 'local');
    const method = req.method || 'GET';
    const request = new Request(`http://127.0.0.1:3001${req.url}`, { method, headers, ...(method !== 'GET' && method !== 'HEAD' ? {body: Buffer.concat(chunks)} : {}) });
    const result = await handler(request);
    res.writeHead(result.status, Object.fromEntries(result.headers)); res.end(Buffer.from(await result.arrayBuffer()));
  } catch { res.writeHead(500); res.end(JSON.stringify({error:'This service is temporarily unavailable.'})); }
});
await new Promise<void>((resolve, reject) => { api.once('error', reject); api.listen(3001, '127.0.0.1', resolve); });
const vite = await createServer({ server: { port: Number(process.env.PORT || 5174), strictPort: true } });
await vite.listen(); vite.printUrls();
console.log('Local booking and contact API is running. Email and bot verification settings are required to send requests. No database is used.');
for (const signal of ['SIGINT','SIGTERM'] as const) process.on(signal, async () => { await vite.close(); api.close(); process.exit(0); });
