import { Core } from "../lib/base44/integrations/core";
import { buildAdminEmail, buildGuestEmail, type EmailBooking } from "../lib/email-templates";

/**
 * POST /api/send-booking-emails
 *
 * Fired in the background after a booking is saved. Sends the guest
 * confirmation email and the internal notification email without blocking
 * the checkout UI. Intentionally fire-and-forget from the client.
 */
export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = (await req.json()) as EmailBooking;

    if (!body.booking_reference || !body.guest_email) {
      return Response.json({ error: "Missing booking fields" }, { status: 400 });
    }

    const guestEmail = buildGuestEmail(body);
    const adminEmailContent = buildAdminEmail(body);

    const guest = await Core.SendEmail({
      to: [body.guest_email],
      subject: `Booking Confirmed — ${body.booking_reference} · ${body.resource.name}`,
      html: guestEmail,
      from_name: "Izzy Place Inn & Suites",
    });

    const adminEmailAddress = process.env.ADMIN_EMAIL;
    const adminRecipients = adminEmailAddress ? [adminEmailAddress] : [];

    const admin = await Core.SendEmail({
      to: adminRecipients,
      subject: `New Booking ${body.booking_reference} — ${body.guest_name}`,
      html: adminEmailContent,
      from_name: "Izzy Place Inn & Suites",
    });

    return Response.json({ ok: true, guest: guest.id, admin: admin.id });
  } catch (error) {
    console.error("[send-booking-emails]", error);
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : "Email send failed" },
      { status: 500 }
    );
  }
}
