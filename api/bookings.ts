import { nodeHandler } from "../lib/server/node-handler.js";
import { requireEmailConfiguration } from '../lib/base44/integrations/core.js';
import { failure, HttpError, jsonBody, rateLimit, response, isAllowedOrigin } from '../lib/server/http.js';
import { validateBooking } from '../lib/server/validation.js';
import { buildBookingRequest } from '../lib/server/booking-request.js';
import { sendHotelBooking } from '../lib/server/notifications.js';
async function submitBooking(req: Request): Promise<Response> {
  if (req.method !== 'POST') return response({error:'Method not allowed'},405);
  try {
    const body = await jsonBody(req);
    const input = validateBooking(body,req.headers.get('idempotency-key'));
    requireEmailConfiguration();
    await rateLimit(req,'booking');
    const booking = buildBookingRequest(input);
    try { await sendHotelBooking(booking,booking.booking_reference); }
    catch { throw new HttpError(503,'We could not send your booking to the hotel. Please retry with the same details or call reception. Your request may already have reached the hotel.'); }
    return response({ok:true,booking_reference:booking.booking_reference,total_amount:booking.total_amount,booking_status:'pending'});
  } catch(error) {return failure(error);}
}

function corsResponse(req: Request, result: Response): Response {
  const origin = req.headers.get("origin");
  if (isAllowedOrigin(origin)) {
    result.headers.set("Access-Control-Allow-Origin", origin!);
    result.headers.set("Vary", "Origin");
  }
  return result;
}

export async function POST(req: Request): Promise<Response> {
  return corsResponse(req, await submitBooking(req));
}

export async function OPTIONS(req: Request): Promise<Response> {
  const headers = (req.headers.get("access-control-request-headers") || "").toLowerCase().split(",").map(h => h.trim()).filter(Boolean);
  if (!isAllowedOrigin(req.headers.get("origin")) || req.headers.get("access-control-request-method") !== "POST" || headers.some(h => !["content-type", "idempotency-key"].includes(h))) {
    return response({ ok: false, error: "Request origin is not allowed." }, 403);
  }
  const result = corsResponse(req, new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } }));
  result.headers.set("Access-Control-Allow-Methods", "POST");
  result.headers.set("Access-Control-Allow-Headers", "Content-Type, Idempotency-Key");
  return result;
}

export default nodeHandler(req => req.method === "OPTIONS" ? OPTIONS(req) : POST(req));
