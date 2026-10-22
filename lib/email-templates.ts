import { siteConfig } from "../src/lib/site";
import { formatNaira, formatDate, formatDateShort } from "../src/lib/utils";

export interface EmailResource {
  name: string;
  price: number;
  unit: "night";
}

export interface EmailAddOn {
  name: string;
  price: number | null;
  quantity: number;
}

export interface EmailBooking {
  booking_reference: string;
  booking_type: "room";
  resource: EmailResource;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in_date: string;
  check_out_date: string;
  number_of_guests: number;
  number_of_rooms: number;
  add_ons: EmailAddOn[];
  special_requests?: string;
  subtotal: number;
  add_on_total: number;
  total_amount: number;
  booking_status: string;
  payment_status: string;
}

const hotelLine = `${siteConfig.name} · ${siteConfig.address.line1}, ${siteConfig.address.line2}, ${siteConfig.address.city}, ${siteConfig.address.state}, ${siteConfig.address.country}`;

export function buildGuestEmail(b: EmailBooking): string {
  const dateRange = `${formatDate(b.check_in_date)} to ${formatDate(b.check_out_date)}`;

  const addOnRows =
    b.add_ons.length > 0
      ? b.add_ons
          .map(
            (a) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee;">${a.name} × ${a.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">${a.price === null ? "Rate varies. Management will confirm the price." : formatNaira(a.price * a.quantity)}</td>
        </tr>`
          )
          .join("")
      : '<tr><td colspan="2" style="padding:8px 0;color:#666;">No add-on services selected.</td></tr>';

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;color:#15271C;max-width:600px;margin:0 auto;">
    <div style="background:#0C3B24;padding:28px;border-radius:10px 10px 0 0;">
      <p style="margin:0;color:#B98A3F;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Izzy Place Inn &amp; Suites</p>
      <h1 style="margin:8px 0 0;color:#FAF6EF;font-size:24px;">Booking Confirmed</h1>
    </div>
    <div style="background:#ffffff;padding:28px;border:1px solid #eee;border-top:none;border-radius:0 0 10px 10px;">
      <p>Dear <strong>${b.guest_name}</strong>,</p>
      <p>Thank you for choosing ${siteConfig.name}. Your booking is confirmed and our 24-hour reception is ready for you.</p>

      <div style="background:#FAF6EF;border:1px solid #E7DED0;border-radius:8px;padding:18px;margin:20px 0;">
        <p style="margin:0 0 10px;font-size:13px;color:#666;">BOOKING REFERENCE</p>
        <p style="margin:0;font-size:22px;font-weight:bold;letter-spacing:1px;color:#0C3B24;">${b.booking_reference}</p>
      </div>

      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:6px 0;color:#666;width:45%;">Stay</td><td style="padding:6px 0;font-weight:600;">${dateRange}</td></tr>
        <tr><td style="padding:6px 0;color:#666;">Room</td><td style="padding:6px 0;font-weight:600;">${b.resource.name}</td></tr>
        <tr><td style="padding:6px 0;color:#666;">Guests</td><td style="padding:6px 0;font-weight:600;">${b.number_of_guests} · ${b.number_of_rooms} room(s)</td></tr>
      </table>

      <h3 style="margin:24px 0 8px;font-size:15px;">Cost breakdown</h3>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee;">${b.resource.name} (${b.number_of_rooms} × ${formatNaira(b.resource.price)} / night)</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">${formatNaira(b.subtotal)}</td>
        </tr>
        ${addOnRows}
        <tr>
          <td style="padding:12px 0;font-size:16px;font-weight:bold;">Room total</td>
          <td style="padding:12px 0;font-size:16px;font-weight:bold;text-align:right;">${formatNaira(
            b.total_amount
          )}</td>
        </tr>
      </table>

      <p style="margin:20px 0 0;font-size:13px;color:#666;">Payment status: <strong>${b.payment_status}</strong>. Our team will contact you to arrange payment. Add-on rates vary, are excluded from the room total, and will be provided by a management representative.</p>

      <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
      <p style="font-size:13px;color:#666;">${hotelLine}<br/>Phone: ${siteConfig.phoneDisplay.join(" / ")}<br/>Email: ${siteConfig.emails.reservations} · ${siteConfig.emails.info}</p>
    </div>
  </div>`;
}

export function buildAdminEmail(b: EmailBooking): string {
  const dateRange = `${formatDateShort(b.check_in_date)} to ${formatDateShort(b.check_out_date)}`;

  const addOnRows =
    b.add_ons.length > 0
      ? b.add_ons
          .map(
            (a) => `
        <tr>
          <td style="padding:6px 8px;border:1px solid #ddd;">${a.name}</td>
          <td style="padding:6px 8px;border:1px solid #ddd;text-align:center;">${a.quantity}</td>
          <td style="padding:6px 8px;border:1px solid #ddd;text-align:right;">${a.price === null ? "Rate varies. Management will confirm the price." : formatNaira(a.price * a.quantity)}</td>
        </tr>`
          )
          .join("")
      : '<tr><td colspan="3" style="padding:6px 8px;border:1px solid #ddd;color:#666;">None</td></tr>';

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;color:#15271C;max-width:640px;margin:0 auto;">
    <div style="background:#0C3B24;padding:24px;border-radius:10px 10px 0 0;">
      <h1 style="margin:0;color:#FAF6EF;font-size:20px;">New Booking. ${b.booking_reference}</h1>
      <p style="margin:6px 0 0;color:#B98A3F;font-size:13px;">${siteConfig.shortName} · ${new Date().toLocaleString("en-NG")}</p>
    </div>
    <div style="background:#ffffff;padding:24px;border:1px solid #eee;border-top:none;border-radius:0 0 10px 10px;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:8px 0;width:35%;color:#666;">Booking reference</td><td style="padding:8px 0;font-weight:bold;">${b.booking_reference}</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Type</td><td style="padding:8px 0;font-weight:600;">Room</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Resource</td><td style="padding:8px 0;font-weight:600;">${b.resource.name}</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Dates</td><td style="padding:8px 0;font-weight:600;">${dateRange}</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Guests / rooms</td><td style="padding:8px 0;">${b.number_of_guests} guest(s) · ${b.number_of_rooms} room(s)</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Guest name</td><td style="padding:8px 0;">${b.guest_name}</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Guest email</td><td style="padding:8px 0;">${b.guest_email}</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Guest phone</td><td style="padding:8px 0;">${b.guest_phone}</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Special requests</td><td style="padding:8px 0;">${b.special_requests || "Not provided"}</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Status</td><td style="padding:8px 0;">${b.booking_status} · ${b.payment_status}</td></tr>
      </table>

      <h3 style="margin:20px 0 8px;font-size:15px;">Add-on services</h3>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <tr style="background:#FAF6EF;">
          <th style="padding:6px 8px;border:1px solid #ddd;text-align:left;">Service</th>
          <th style="padding:6px 8px;border:1px solid #ddd;">Qty</th>
          <th style="padding:6px 8px;border:1px solid #ddd;text-align:right;">Amount</th>
        </tr>
        ${addOnRows}
      </table>

      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:16px;">
        <tr><td style="padding:8px 0;color:#666;">Subtotal</td><td style="padding:8px 0;text-align:right;">${formatNaira(b.subtotal)}</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Add-ons</td><td style="padding:8px 0;text-align:right;">${b.add_ons.some((a) => a.price === null) ? "Rates provided by management; excluded from room total" : formatNaira(b.add_on_total)}</td></tr>
        <tr><td style="padding:10px 0;font-size:16px;font-weight:bold;">Room total</td><td style="padding:10px 0;font-size:16px;font-weight:bold;text-align:right;">${formatNaira(b.total_amount)}</td></tr>
      </table>
    </div>
  </div>`;
}
