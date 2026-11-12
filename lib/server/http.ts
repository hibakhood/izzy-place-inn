import { createHash } from "node:crypto";

export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export function response(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
}
export function failure(error: unknown) {
  // Never log request bodies, guest details, provider responses or secrets.
  const status = error instanceof HttpError ? error.status : 503;
  return response({ ok: false, error: error instanceof HttpError ? error.message : "We could not complete your request. Please try again or call reception." }, status);
}
export async function jsonBody(req: Request): Promise<Record<string, unknown>> {
  if (!req.headers.get("content-type")?.includes("application/json")) throw new HttpError(415, "Please send a JSON request.");
  const origin = req.headers.get("origin");
  const expected = process.env.SITE_ORIGIN || "https://izzyplaceinn.com";
  const local = process.env.NODE_ENV !== "production" && origin && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  const hotelOrigins = new Set(["https://izzyplaceinn.com", "https://www.izzyplaceinn.com"]);
  const canonicalAlias = hotelOrigins.has(expected) && origin !== null && hotelOrigins.has(origin);
  if (origin && origin !== expected && !canonicalAlias && !local) throw new HttpError(403, "Request origin is not allowed.");
  if (Number(req.headers.get("content-length") || 0) > 16384) throw new HttpError(413, "Your request is too long.");
  const reader = req.body?.getReader();
  if (!reader) throw new HttpError(400, "Please complete the form.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > 16384) { await reader.cancel(); throw new HttpError(413, "Your request is too long."); }
    chunks.push(value);
  }
  try {
    const value = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!value || Array.isArray(value) || typeof value !== "object") throw new Error();
    return value;
  } catch { throw new HttpError(400, "Please check the form and try again."); }
}
export function text(value: unknown, name: string, max: number, optional = false): string {
  if (optional && (value === undefined || value === "")) return "";
  if (typeof value !== "string" || !value.trim() || value.trim().length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) throw new HttpError(400, `Please check ${name}.`);
  return value.trim();
}
export function email(value: unknown) {
  const result = text(value, "your email address", 254).toLowerCase();
  if (!/^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/.test(result)) throw new HttpError(400, "Please enter a valid email address.");
  return result;
}
export function integer(value: unknown, name: string, max: number) {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1 || value > max) throw new HttpError(400, `Please check ${name}.`);
  return value;
}
// A bounded per-process throttle limits booking and contact requests. It is
// deliberately not described as a global/durable limit across serverless workers.
const buckets = new Map<string, { count: number; until: number }>();
export async function rateLimit(req: Request, action: "booking" | "contact") {
  const secret = process.env.RATE_LIMIT_SECRET;
  if (!secret) throw new HttpError(503, "This service is temporarily unavailable. Please call reception.");
  const now = Date.now();
  for (const [key, bucket] of buckets) if (bucket.until <= now) buckets.delete(key);
  const key = createHash("sha256").update(`${secret}:${action}:${req.headers.get("x-real-ip") || "unknown"}`).digest("hex");
  let bucket = buckets.get(key);
  if (!bucket) {
    if (buckets.size >= 5000) throw new HttpError(429, "Please try again in a few minutes.");
    bucket = {count:0,until:now+900000}; buckets.set(key,bucket);
  }
  if (++bucket.count > (action === "booking" ? 10 : 5)) throw new HttpError(429,"Too many requests. Please wait a few minutes and try again.");
}
