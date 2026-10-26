import { Core } from "../base44/integrations/core";
import { buildAdminEmail, buildGuestEmail, type EmailBooking } from "../email-templates";
import { siteConfig } from "../../src/lib/site";

export function hotelRecipients(): string[] {
  const extra = (process.env.ADMIN_EMAIL || "").split(",").map(e => e.trim()).filter(Boolean);
  return [...new Set([siteConfig.emails.reservations, siteConfig.emails.info, ...extra])];
}
// Hotel acceptance must precede any guest confirmation. An injected sender enables
// tests without delivering emails or accessing guest data.
export async function sendConfirmationPair(b: EmailBooking, bookingId: string, hotelAlreadySent = false, send = Core.SendEmail, markHotel: () => Promise<void> = async () => {}) {
  if (!hotelAlreadySent) {
    await send({ to: hotelRecipients(), subject: `New booking ${b.booking_reference}`, html: buildAdminEmail(b), idempotencyKey: `booking/${bookingId}/hotel` });
    await markHotel();
  }
  await send({ to: [b.guest_email], subject: `Booking request received: ${b.booking_reference}`, html: buildGuestEmail(b), idempotencyKey: `booking/${bookingId}/guest` });
}
