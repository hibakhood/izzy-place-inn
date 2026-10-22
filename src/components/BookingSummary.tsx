import { CalendarDays, Users, BedDouble, Hotel, MapPin, Check } from "lucide-react";
import type { AddOnService, RoomCategory } from "@/types";
import { addOnServices } from "@/data/addons";
import { formatNaira, formatDateShort, nightsBetween } from "@/lib/utils";
import { cn } from "@/lib/utils";

export interface BookingTotals {
  subtotal: number;
  addOnTotal: number;
  total: number;
  units: number;
  unitLabel: string;
}

interface BookingSummaryProps {
  resource?: RoomCategory | null;
  checkIn?: Date;
  checkOut?: Date;
  guests: number;
  numRooms: number;
  addOns: Record<string, number>;
  totals: BookingTotals;
  className?: string;
}

function AddOnLine({ id, qty }: { id: string; qty: number }) {
  const svc = addOnServices.find((s) => s.id === id) as AddOnService | undefined;
  if (!svc || qty <= 0) return null;
  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span className="text-muted-foreground">
        {svc.name} <span className="text-xs text-muted-foreground/70">× {qty}</span>
      </span>
      <span className="font-medium">{svc.price === null ? "Rate varies" : formatNaira(svc.price * qty)}</span>
    </div>
  );
}

export default function BookingSummary({
  resource,
  checkIn,
  checkOut,
  guests,
  numRooms,
  addOns,
  totals,
  className,
}: BookingSummaryProps) {
  const hasResource = Boolean(resource);
  const hasDates = Boolean(checkIn && checkOut);

  return (
    <aside className={cn("rounded-lg border border-border/70 bg-card p-6 shadow-sm", className)}>
      <h2 className="font-display text-lg font-semibold text-ink">Booking summary</h2>

      {!hasResource ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Select a room or suite to see your summary.
        </p>
      ) : (
        <>
          <div className="mt-4 rounded-md bg-cream-100 p-3">
            <p className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Hotel className="h-4 w-4 text-primary" />
              {resource!.name}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> Izzy Place Inn &amp; Suites
            </p>
          </div>

          <dl className="mt-4 space-y-3 text-sm">
            {hasDates && (
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  Dates
                </dt>
                <dd className="text-right font-medium">
                  {formatDateShort(checkIn!.toISOString())} → {formatDateShort(checkOut!.toISOString())}
                  <span className="block text-xs text-muted-foreground">
                    {nightsBetween(checkIn!.toISOString(), checkOut!.toISOString())} night(s)
                  </span>
                </dd>
              </div>
            )}

            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" /> Guests
              </dt>
              <dd className="font-medium">{guests}</dd>
            </div>

            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-2 text-muted-foreground">
                <BedDouble className="h-4 w-4" /> Rooms
              </dt>
              <dd className="font-medium">{numRooms}</dd>
            </div>
          </dl>

          <div className="mt-4 border-t border-border/70 pt-3">
            <div className="flex items-center justify-between py-1 text-sm">
              <span className="text-muted-foreground">
                {resource!.name} · {numRooms} × {formatNaira(resource!.price_per_night)}
              </span>
              <span className="font-medium">{formatNaira(totals.subtotal)}</span>
            </div>

            {Object.entries(addOns)
              .filter(([, qty]) => qty > 0)
              .map(([id, qty]) => (
                <AddOnLine key={id} id={id} qty={qty} />
              ))}

            {Object.values(addOns).some((q) => q > 0) && (
              <div className="flex items-center justify-between py-1.5 text-sm">
                <span className="text-muted-foreground">Add-on rates</span>
                <span className="font-medium">Confirmed by management</span>
              </div>
            )}
          </div>

          <div className="mt-2 flex items-center justify-between border-t border-border/70 pt-3">
            <span className="font-semibold text-ink">Room total</span>
            <span className="font-display text-2xl font-semibold text-primary">
              {formatNaira(totals.total)}
            </span>
          </div>

          <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <Check className="h-3.5 w-3.5 text-primary" />
            Free cancellation up to 48 hours before arrival.
          </p>
        </>
      )}
    </aside>
  );
}
