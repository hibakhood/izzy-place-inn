import { asset } from "@/lib/utils";
import type { ReactNode } from "react";
import { formatDate, formatNaira } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
import { getAddOnById } from "@/data/addons";
import type { BookingTotals } from "./BookingSummary";
import type { AddOnSelection, RoomCategory } from "@/types";

interface BookingConfirmationPrintProps {
  resource: RoomCategory;
  checkIn?: Date;
  checkOut?: Date;
  guests: number;
  numRooms: number;
  addOns: Record<string, number>;
  totals: BookingTotals;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
  bookingReference: string;
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-ink">{label}</p>
      <p className="mt-1 text-[0.95rem] leading-snug text-ink">{children}</p>
    </div>
  );
}

export default function BookingConfirmationPrint({
  resource,
  checkIn,
  checkOut,
  guests,
  numRooms,
  addOns,
  totals,
  guestName,
  guestEmail,
  guestPhone,
  specialRequests,
  bookingReference,
}: BookingConfirmationPrintProps) {
  const unitLabel = "night";
  const unitPrice = resource.price_per_night;
  const selectedAddOns: { id: string; name: string; qty: number; price: number | null }[] =
    Object.entries(addOns)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => {
        const svc = getAddOnById(id);
        return { id, name: svc?.name ?? id, qty, price: svc?.price ?? null };
      });
  const nights = checkIn && checkOut
    ? Math.max(1, Math.round((checkOut.getTime() - checkIn.getTime()) / 86400000))
    : 1;
  const units = nights * numRooms;

  return (
    <div className="hidden bg-ivory p-10 text-ink print:block">
      <div className="border-b-2 border-forest-950 pb-6">
        <div className="flex items-start justify-between gap-8">
          <div className="flex items-center gap-3">
            <img
              src={asset("/images/brand/izzy-logo-forest-gold.png")}
              alt="Izzy Place Inn & Suites logo"
              width={84}
              height={56}
              className="h-14 w-[84px] object-contain"
            />
            <div>
              <p className="font-display text-xl font-bold leading-none text-ink">{siteConfig.name}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-ink">
                {siteConfig.address.city}, {siteConfig.address.state},{" "}
                {siteConfig.address.country}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-display text-2xl font-bold text-ink">Booking Confirmation</p>
            <p className="mt-1 text-sm font-semibold tracking-[0.2em] text-ink">{bookingReference}</p>
          </div>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-ink">
          {siteConfig.address.line1} · {siteConfig.address.line2} · {siteConfig.address.city},{" "}
          {siteConfig.address.state} · {siteConfig.address.country} · {siteConfig.phones.join(" · ")} ·{" "}
          {siteConfig.emails.reservations}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-x-12 gap-y-7">
        <Detail label="Guest name">{guestName}</Detail>
        <Detail label="Booking reference">{bookingReference}</Detail>
        <Detail label="Email">{guestEmail}</Detail>
        <Detail label="Phone">{guestPhone}</Detail>
        <Detail label="Arrival">{checkIn ? formatDate(checkIn) : "Not provided"}</Detail>
        <Detail label="Departure">{checkOut ? formatDate(checkOut) : "Not provided"}</Detail>
        <Detail label="Booking type">Hotel room</Detail>
        <Detail label="Number of rooms">{numRooms} room(s)</Detail>
        <Detail label="Guests">{guests}</Detail>
        <Detail label="Duration">
          {units} {unitLabel}(s)
        </Detail>
      </div>

      <div className="mt-8 border-t border-forest-950 pt-6">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-ink">
          Room
        </p>
        <div className="mt-3 flex items-center justify-between border-b border-line py-2 text-sm">
          <span className="font-semibold text-ink">{resource.name}</span>
          <span>
            {formatNaira(unitPrice)} × {units} {unitLabel}(s)
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between py-2 text-sm">
          <span className="text-ink">Subtotal</span>
          <span className="font-semibold text-ink">{formatNaira(totals.subtotal)}</span>
        </div>

        {selectedAddOns.length > 0 && (
          <>
            <p className="mt-4 text-sm font-bold uppercase tracking-[0.14em] text-ink">Add-on services</p>
            {selectedAddOns.map((a) => (
              <div key={a.id} className="mt-2 flex items-center justify-between border-b border-line py-2 text-sm">
                <span className="text-ink">
                  {a.name} <span className="text-ink">× {a.qty}</span>
                </span>
                <span className="font-semibold text-ink">{a.price === null ? "Rate varies" : formatNaira(a.price * a.qty)}</span>
              </div>
            ))}
            <div className="mt-1 flex items-center justify-between py-2 text-sm">
              <span className="text-ink">Add-on rates</span>
              <span className="font-semibold text-ink">Provided by management</span>
            </div>
          </>
        )}

        <div className="mt-5 flex items-center justify-between border-t-2 border-forest-950 py-3">
          <span className="font-display text-lg font-bold text-ink">Room total</span>
          <span className="font-display text-2xl font-bold text-ink">{formatNaira(totals.total)}</span>
        </div>
      </div>

      {specialRequests && (
        <div className="mt-6">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-ink">Special requests</p>
          <p className="mt-2 text-sm leading-relaxed text-ink">{specialRequests}</p>
        </div>
      )}

      <div className="mt-10 border-t border-line pt-5 text-xs leading-relaxed text-ink">
        <p>
          Your booking is confirmed and held at {siteConfig.name}. Payment of{" "}
          {formatNaira(totals.total)} is due by arrangement with our reservations team. For changes or
          help, call {siteConfig.phones[0]} or email {siteConfig.emails.reservations}. Our reception is
          open 24 hours, every day.
        </p>
      </div>
    </div>
  );
}
