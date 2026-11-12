import { nodeHandler } from "../lib/server/node-handler.js";
import { requireEmailConfiguration } from '../lib/base44/integrations/core.js';
import { failure, HttpError, jsonBody, rateLimit, response } from '../lib/server/http.js';
import { validateBooking } from '../lib/server/validation.js';
import { buildBookingRequest } from '../lib/server/booking-request.js';
import { sendHotelBooking } from '../lib/server/notifications.js';
export async function POST(req: Request): Promise<Response> {
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

export default nodeHandler(POST);
