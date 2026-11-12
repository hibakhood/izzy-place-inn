import type { BookingRequest } from './booking';

export function bookingConfirmationText(booking: BookingRequest, reference: string, roomName: string, total: number, extras: string[], hotelContact: string): string {
  return [
    'Izzy Place Inn & Suites',
    'Booking request received',
    `Reference: ${reference}`,
    '',
    `Guest: ${booking.guest_name}`,
    `Email: ${booking.guest_email}`,
    `Phone: ${booking.guest_phone}`,
    `Room: ${roomName}`,
    `Arrival: ${booking.check_in_date}`,
    `Departure: ${booking.check_out_date}`,
    `Rooms: ${booking.number_of_rooms}`,
    `Guests: ${booking.number_of_guests}`,
    `Estimated room total: NGN ${total.toLocaleString('en-NG')}`,
    '',
    'Optional extras:',
    ...(extras.length ? extras : ['None requested']),
    ...(extras.length ? ['Extra service rates will be provided by management and are not included in the room total.'] : []),
    ...(booking.special_requests ? ['', `Special requests: ${booking.special_requests}`] : []),
    '',
    'Your request has been sent to the hotel. Our team will confirm availability and arrange payment. This is not a payment receipt or a confirmed reservation.',
    `Reception: ${hotelContact}`,
  ].join('\n');
}
