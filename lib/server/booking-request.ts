import { createHmac } from 'node:crypto';
import { roomRates } from '../../src/data/room-rates';
import { addOnServices } from '../../src/data/addons';
import { HttpError } from './http';
import { validateBooking } from './validation';
import type { EmailBooking } from '../email-templates';

export function buildBookingRequest(input: ReturnType<typeof validateBooking>): EmailBooking {
  const secret = process.env.BOOKING_REFERENCE_SECRET;
  if (!secret) throw new HttpError(503,'Booking requests are temporarily unavailable. Please call reception.');
  const room = roomRates[input.room_category_id];
  if (!room || input.number_of_guests > room.maxGuests * input.number_of_rooms || input.number_of_rooms > room.maxRooms) throw new HttpError(400,'Please check your room and guest numbers.');
  const nights = (Date.parse(input.check_out_date)-Date.parse(input.check_in_date))/86400000;
  // The same validated details/key yield exactly the same reference and email body.
  const digest = createHmac('sha256',secret).update(JSON.stringify(input)).digest('hex');
  const total = room.price * nights * input.number_of_rooms;
  return { booking_reference:`IZ-${digest.slice(0,16).toUpperCase()}`,booking_type:'room',resource:{name:room.name,price:room.price,unit:'night'},guest_name:input.guest_name,guest_email:input.guest_email,guest_phone:input.guest_phone,check_in_date:input.check_in_date,check_out_date:input.check_out_date,number_of_guests:input.number_of_guests,number_of_rooms:input.number_of_rooms,add_ons:input.add_on_services.map(a=>({name:addOnServices.find(s=>s.id===a.id)!.name,price:null,quantity:a.quantity})),special_requests:input.special_requests,subtotal:total,add_on_total:0,total_amount:total,booking_status:'pending',payment_status:'pending'};
}
