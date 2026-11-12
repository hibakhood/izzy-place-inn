import type { IncomingMessage, ServerResponse } from 'node:http';
import { failure, HttpError } from './http.js';

// Adapt the shared Web Request handler to Vercel's Node function interface.
export function nodeHandler(handle: (request: Request) => Promise<Response>) {
  return async (req: IncomingMessage & { body?: unknown }, res: ServerResponse) => {
    try {
      const headers = new Headers();
      for (const [name, value] of Object.entries(req.headers)) {
        if (value !== undefined) headers.set(name, Array.isArray(value) ? value.join(',') : value);
      }
      const method = req.method || 'GET';
      let body: string | undefined;
      if (method !== 'GET' && method !== 'HEAD') {
        if (req.body !== undefined) {
          body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
          if (Buffer.byteLength(body) > 16384) throw new HttpError(413, 'Your request is too long.');
        } else {
          const chunks: Buffer[] = [];
          let size = 0;
          for await (const chunk of req) {
            size += Buffer.byteLength(chunk);
            if (size > 16384) throw new HttpError(413, 'Your request is too long.');
            chunks.push(Buffer.from(chunk));
          }
          body = Buffer.concat(chunks).toString('utf8');
        }
      }
      const request = new Request(`https://www.izzyplaceinn.com${req.url || '/'}`, { method, headers, ...(body !== undefined ? { body } : {}) });
      const result = await handle(request);
      res.writeHead(result.status, Object.fromEntries(result.headers));
      res.end(Buffer.from(await result.arrayBuffer()));
    } catch (error) {
      const result = failure(error);
      res.writeHead(result.status, Object.fromEntries(result.headers));
      res.end(Buffer.from(await result.arrayBuffer()));
    }
  };
}
