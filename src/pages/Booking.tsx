import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Seo from "@/components/Seo";
import BookingSummary, { type BookingTotals } from "@/components/BookingSummary";
import BookingWizard from "@/components/BookingWizard";
import BookingConfirmationPrint from "@/components/BookingConfirmationPrint";
import { useRooms } from "@/hooks/useCatalog";
import { canonicalRoomSlug } from "@/lib/data";
import { saveBooking, sendBookingEmails } from "@/lib/booking";
import { getAddOnById } from "@/data/addons";
import {
  formatNaira,
  generateBookingReference,
  nightsBetween,
} from "@/lib/utils";
import { Loader2, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site";
import type { AddOnSelection, BookingPayload, RoomCategory } from "@/types";

interface GuestInfo {
  name: string;
  email: string;
  phone: string;
  requests: string;
}


export default function Booking() {
  const [searchParams] = useSearchParams();
  const { rooms, loading: roomsLoading } = useRooms();

  const slugParam = searchParams.get("slug");
  const checkinParam = searchParams.get("checkin");
  const checkoutParam = searchParams.get("checkout");
  const guestsParam = searchParams.get("guests");

  const parseDate = (v: string | null): Date | undefined => {
    if (!v) return undefined;
    const d = new Date(`${v}T12:00:00`);
    return isNaN(d.getTime()) ? undefined : d;
  };

  const [resource, setResource] = useState<RoomCategory | null>(null);
  const [step, setStep] = useState(1);
  const [checkIn, setCheckIn] = useState<Date | undefined>(parseDate(checkinParam));
  const [checkOut, setCheckOut] = useState<Date | undefined>(parseDate(checkoutParam));
  const [guests, setGuests] = useState(
    guestsParam && !isNaN(Number(guestsParam)) && Number(guestsParam) >= 1 ? Number(guestsParam) : 2
  );
  const [numRooms, setNumRooms] = useState(1);
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({ name: "", email: "", phone: "", requests: "" });
  const [addOns, setAddOns] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingReference, setBookingReference] = useState("");

  const catalog = rooms;
  const loading = roomsLoading;

  // Auto-select a resource from ?type=room&slug=...
  useEffect(() => {
    if (!slugParam || !catalog) return;
    const found = catalog.find((r) => r.slug === canonicalRoomSlug(slugParam));
    if (found) {
      setResource(found);
      setStep(1);
    }
  }, [slugParam, catalog]);

  const totals = useMemo<BookingTotals>(() => {
    if (!resource) {
      return { subtotal: 0, addOnTotal: 0, total: 0, units: 0, unitLabel: "night" };
    }
    const nights = checkIn && checkOut ? nightsBetween(checkIn.toISOString(), checkOut.toISOString()) : 0;
    const units = nights * numRooms;
    const unitPrice = resource.price_per_night;
    const subtotal = units * unitPrice;
    const addOnTotal = Object.entries(addOns).reduce((sum, [id, qty]) => {
      const svc = getAddOnById(id);
      return svc && qty > 0 ? sum + (svc.price ?? 0) * qty : sum;
    }, 0);
    return {
      subtotal,
      addOnTotal,
      total: subtotal + addOnTotal,
      units,
      unitLabel: "night",
    };
  }, [resource, checkIn, checkOut, numRooms, addOns]);

  const handleSubmit = async () => {
    if (!resource || !checkIn || !checkOut) return;
    setSubmitting(true);
    setError(null);

    const reference = generateBookingReference();
    const unitPrice = resource.price_per_night;

    // Capture a snapshot of the resource object before any state changes.
    const resourceSnapshot = {
      name: resource.name,
      price: unitPrice,
      unit: "night",
    };

    const addOnSelections: AddOnSelection[] = Object.entries(addOns)
      .filter(([, qty]) => qty > 0)
      .map(([id, quantity]) => ({ id, quantity }));

    const payload: BookingPayload = {
      booking_type: "room",
      room_category_id: resource.id,
      guest_name: guestInfo.name.trim(),
      guest_email: guestInfo.email.trim(),
      guest_phone: guestInfo.phone.trim(),
      check_in_date: checkIn.toISOString().split("T")[0],
      check_out_date: checkOut.toISOString().split("T")[0],
      number_of_guests: guests,
      number_of_rooms: numRooms,
      add_on_services: addOnSelections,
      special_requests: guestInfo.requests.trim() || undefined,
      total_amount: totals.total,
      payment_status: "pending",
      booking_status: "confirmed",
      booking_reference: reference,
    };

    const res = await saveBooking(payload);
    if (!res.ok) {
      setError(`We could not save your booking just now (${res.error}). Please try again or call us.`);
      setSubmitting(false);
      return;
    }

    setBookingReference(reference);
    setStep(4);
    setSubmitting(false);

    const emailAddOns = addOnSelections
      .map((s) => {
        const svc = getAddOnById(s.id);
        return svc ? { name: svc.name, price: svc.price, quantity: s.quantity } : null;
      })
      .filter((x): x is { name: string; price: number; quantity: number } => x !== null);

    sendBookingEmails({
      booking_reference: reference,
      booking_type: "room",
      resource: resourceSnapshot,
      guest_name: payload.guest_name,
      guest_email: payload.guest_email,
      guest_phone: payload.guest_phone,
      check_in_date: payload.check_in_date,
      check_out_date: payload.check_out_date,
      number_of_guests: payload.number_of_guests,
      number_of_rooms: payload.number_of_rooms,
      add_ons: emailAddOns,
      special_requests: payload.special_requests,
      subtotal: totals.subtotal,
      add_on_total: totals.addOnTotal,
      total_amount: totals.total,
      booking_status: payload.booking_status,
      payment_status: payload.payment_status,
    });
  };

  const handleReset = () => {
    setResource(null);
    setCheckIn(undefined);
    setCheckOut(undefined);
    setGuests(2);
    setNumRooms(1);
    setAddOns({});
    setError(null);
    setStep(1);
  };

  return (
    <>
      <Seo
        title="Book Your Stay"
        description="Book a room or suite at Izzy Place Inn & Suites, Ibadan. Choose your dates, add extras and confirm your stay in minutes."
        keywords="book hotel Ibadan, book rooms and suites Ibadan, Izzy Place Inn booking"
        path="/book"
      />

      <section className="border-b border-line print:hidden">
        <div className="container-site py-10 md:py-14">
          <p className="eyebrow">Reservations</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-ink md:text-4xl">
            {step === 4 ? "Booking confirmed" : "Book your stay"}
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {step === 4
              ? `Thank you, ${guestInfo.name.split(" ")[0]}. Your reservation is confirmed and a copy is on its way to your inbox.`
              : "Choose your room, dates and any extras. Our team will contact you to arrange payment."}
          </p>
        </div>
      </section>

      <section className="container-site py-10 md:py-14 print:hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div>
              <BookingWizard
                rooms={rooms ?? []}
                resource={resource}
                setResource={setResource}
                step={step}
                setStep={setStep}
                checkIn={checkIn}
                checkOut={checkOut}
                setCheckIn={setCheckIn}
                setCheckOut={setCheckOut}
                guests={guests}
                setGuests={setGuests}
                numRooms={numRooms}
                setNumRooms={setNumRooms}
                guestInfo={guestInfo}
                setGuestInfo={setGuestInfo}
                addOns={addOns}
                setAddOns={setAddOns}
                totals={totals}
                submitting={submitting}
                error={error}
                bookingReference={bookingReference}
                onSubmit={handleSubmit}
                onReset={handleReset}
              />
            </div>

            <div>
              <BookingSummary
                resource={resource}
                checkIn={checkIn}
                checkOut={checkOut}
                guests={guests}
                numRooms={numRooms}
                addOns={addOns}
                totals={totals}
                className="sticky top-24"
              />
              <div className="mt-6 flex items-start gap-3 rounded-lg border border-border/70 bg-card p-4">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p className="text-sm text-muted-foreground">
                  Prefer to book by phone? Call{" "}
                  <a href={`tel:${siteConfig.phones[0].replace(/[^+\d]/g, "")}`} className="font-semibold text-primary hover:underline">
                    {siteConfig.phones[0]}
                  </a>
                  , our reception is available around the clock.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {step === 4 && resource && (
        <BookingConfirmationPrint
          resource={resource}
          checkIn={checkIn}
          checkOut={checkOut}
          guests={guests}
          numRooms={numRooms}
          addOns={addOns}
          totals={totals}
          guestName={guestInfo.name.trim()}
          guestEmail={guestInfo.email.trim()}
          guestPhone={guestInfo.phone.trim()}
          specialRequests={guestInfo.requests.trim() || undefined}
          bookingReference={bookingReference}
        />
      )}
    </>
  );
}
