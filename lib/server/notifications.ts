import { Core } from "../base44/integrations/core.js";
import { buildAdminEmail, type EmailBooking } from "../email-templates.js";
import { siteConfig } from "../../src/lib/site.js";

export function hotelRecipients(): string[] {
  const extra = (process.env.ADMIN_EMAIL || "").split(",").map(e => e.trim()).filter(Boolean);
  return [...new Set([siteConfig.emails.reservations, siteConfig.emails.info, ...extra])];
}
// A successful request requires acceptance by the hotel's email provider.
export async function sendHotelBooking(b: EmailBooking, bookingId: string, send = Core.SendEmail) {
  await send({ to: [siteConfig.emails.info], subject: `New booking ${b.booking_reference}`, html: buildAdminEmail(b), idempotencyKey: `booking/${bookingId}/hotel` });
}
