import SecurityCheck from "@/components/SecurityCheck";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Seo from "@/components/Seo";
import BookingSummary, { type BookingTotals } from "@/components/BookingSummary";
import BookingWizard from "@/components/BookingWizard";
import BookingConfirmationPrint from "@/components/BookingConfirmationPrint";
import { useRooms } from "@/hooks/useCatalog";
import { canonicalRoomSlug } from "@/lib/data";
import { saveBooking, type BookingRequest } from "@/lib/booking";
import { getAddOnById } from "@/data/addons";
import {
  formatNaira,
  nightsBetween,
} from "@/lib/utils";
import { Loader2, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site";
import type { RoomCategory } from "@/types";

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
  const [botToken, setBotToken] = useState("");
  const [securityAttempt, setSecurityAttempt] = useState(0);
  const [confirmedTotal, setConfirmedTotal] = useState<number | null>(null);
  const requestAttempt = useRef<{ fingerprint: string; key: string } | null>(null);

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
    if (!resource || !checkIn || !checkOut || submitting || !botToken) return;
    setSubmitting(true);
    setError(null);
    const localDate = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const payload: BookingRequest = {
      room_category_id: resource.id,
      guest_name: guestInfo.name.trim(),
      guest_email: guestInfo.email.trim(),
      guest_phone: guestInfo.phone.trim(),
      check_in_date: localDate(checkIn),
      check_out_date: localDate(checkOut),
      number_of_guests: guests,
      number_of_rooms: numRooms,
      add_on_services: Object.entries(addOns).filter(([, quantity]) => quantity > 0).sort(([a], [b]) => a.localeCompare(b)).map(([id, quantity]) => ({ id, quantity })),
      special_requests: guestInfo.requests.trim() || undefined,
    };
    try {
      const fingerprint = JSON.stringify(payload);
      if (requestAttempt.current?.fingerprint !== fingerprint) {
        let key = crypto.randomUUID();
        // Persist only a digest and random key, never guest details. This also
        // protects an unchanged request retried after a page refresh.
        try {
          const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(fingerprint));
          const hash = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
          const previous = JSON.parse(sessionStorage.getItem("izzy-booking-attempt") || "null");
          if (previous?.hash === hash && typeof previous.key === "string") key = previous.key;
          sessionStorage.setItem("izzy-booking-attempt", JSON.stringify({ hash, key }));
        } catch { /* Private browsing may disable storage; same-page retries remain protected. */ }
        requestAttempt.current = { fingerprint, key };
      }
      const res = await saveBooking(payload, requestAttempt.current.key, botToken);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setBookingReference(res.booking_reference);
      setConfirmedTotal(res.total_amount);
      setStep(4);
    } catch {
      setError("We could not confirm your booking. Please retry with the same details or call reception.");
    } finally {
      setSubmitting(false);
      setBotToken("");
      setSecurityAttempt(n => n + 1);
    }
  };

  const handleReset = () => {
    setConfirmedTotal(null);
    requestAttempt.current = null;
    try { sessionStorage.removeItem("izzy-booking-attempt"); } catch { /* Storage is optional. */ }
    setResource(null);
    setCheckIn(undefined);
    setCheckOut(undefined);
    setGuests(2);
    setNumRooms(1);
    setAddOns({});
    setError(null);
    setStep(1);
  };

  const displayedTotals = step !== 4 || confirmedTotal === null ? totals : { ...totals, subtotal: confirmedTotal, addOnTotal: 0, total: confirmedTotal };

  return (
    <>
      <Seo
        title="Book Your Stay"
        description="Book a room or suite at Izzy Place Inn & Suites, Ibadan. Choose your dates, add extras and send your booking request in minutes."
        keywords="book hotel Ibadan, book rooms and suites Ibadan, Izzy Place Inn booking"
        path="/book"
      />

      <section className="border-b border-line print:hidden">
        <div className="container-site py-10 md:py-14">
          <p className="eyebrow">Reservations</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-ink md:text-4xl">
            {step === 4 ? "Booking request received" : "Book your stay"}
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {step === 4
              ? `Thank you, ${guestInfo.name.split(" ")[0]}. Your request has been sent to the hotel. Our team will confirm availability with you.`
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
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              {step === 3 && <SecurityCheck key={securityAttempt} action="booking" onVerify={setBotToken} />}
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
                totals={displayedTotals}
                submitting={submitting}
                securityReady={Boolean(botToken)}
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
                totals={displayedTotals}
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
          totals={displayedTotals}
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
