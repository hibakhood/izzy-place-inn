import { requireEmailConfiguration } from '../lib/base44/integrations/core';
import { failure, HttpError, jsonBody, rateLimit, response } from '../lib/server/http';
import { validateBooking } from '../lib/server/validation';
import { buildBookingRequest } from '../lib/server/booking-request';
import { sendHotelBooking } from '../lib/server/notifications';
import { verifyBotCheck } from '../lib/server/bot-check';
export async function POST(req: Request): Promise<Response> {
  if (req.method !== 'POST') return response({error:'Method not allowed'},405);
  try {
    const body = await jsonBody(req);
    const input = validateBooking(body,req.headers.get('idempotency-key'));
    requireEmailConfiguration();
    await rateLimit(req,'booking');
    const booking = buildBookingRequest(input);
    await verifyBotCheck(body.bot_token,'booking');
    try { await sendHotelBooking(booking,booking.booking_reference); }
    catch { throw new HttpError(503,'We could not send your booking to the hotel. Please retry with the same details or call reception. Your request may already have reached the hotel.'); }
    return response({ok:true,booking_reference:booking.booking_reference,total_amount:booking.total_amount,booking_status:'pending'});
  } catch(error) {return failure(error);}
}
