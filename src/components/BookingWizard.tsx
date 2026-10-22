import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  User,
  Sparkles,
  CheckCircle2,
  Check,
  Minus,
  Plus,
  ArrowLeft,
  ArrowRight,
  Loader2,
  PartyPopper,
  Printer,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { addOnServices } from "@/data/addons";
import { iconMap } from "@/lib/icons";
import { formatNaira, cn } from "@/lib/utils";
import type { BookingTotals } from "./BookingSummary";
import type { AddOnService, RoomCategory } from "@/types";

interface GuestInfo {
  name: string;
  email: string;
  phone: string;
  requests: string;
}

interface BookingWizardProps {

  rooms: RoomCategory[];
  resource: RoomCategory | null;
  setResource: (r: RoomCategory) => void;
  step: number;
  setStep: (n: number) => void;
  checkIn?: Date;
  checkOut?: Date;
  setCheckIn: (d?: Date) => void;
  setCheckOut: (d?: Date) => void;
  guests: number;
  setGuests: (n: number) => void;
  numRooms: number;
  setNumRooms: (n: number) => void;
  guestInfo: GuestInfo;
  setGuestInfo: (g: GuestInfo) => void;
  addOns: Record<string, number>;
  setAddOns: (a: Record<string, number>) => void;
  totals: BookingTotals;
  submitting: boolean;
  error: string | null;
  bookingReference: string;
  onSubmit: () => void;
  onReset: () => void;
}

const STEPS = [
  { n: 1, label: "Dates & Guests", icon: CalendarDays },
  { n: 2, label: "Your Details", icon: User },
  { n: 3, label: "Add-ons", icon: Sparkles },
];

function QtyStepper({
  value,
  onChange,
  label,
  min = 1,
  max = 20,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center rounded-md border border-border bg-card">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          aria-label={`Decrease ${label}`}
          className="flex h-9 w-9 items-center justify-center text-ink transition-colors hover:bg-secondary disabled:opacity-40"
          disabled={value <= min}
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-10 text-center text-sm font-semibold">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          aria-label={`Increase ${label}`}
          className="flex h-9 w-9 items-center justify-center text-ink transition-colors hover:bg-secondary disabled:opacity-40"
          disabled={value >= max}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function AddOnCard({
  service,
  qty,
  onChange,
}: {
  service: AddOnService;
  qty: number;
  onChange: (q: number) => void;
}) {
  const Icon = iconMap[service.icon] ?? Sparkles;
  return (
    <div
      className={cn(
        "flex items-start gap-4 rounded-lg border p-4 transition-colors",
        qty > 0 ? "border-primary/50 bg-primary/5" : "border-border/70 bg-card"
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="font-semibold text-ink">{service.name}</h4>
          <p className="shrink-0 text-sm font-semibold text-primary">{service.price === null ? "Rate varies" : formatNaira(service.price)}</p>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{service.description}</p>
        <div className="mt-3">
          <QtyStepper
            label="Quantity"
            value={qty}
            min={0}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
}

export default function BookingWizard(props: BookingWizardProps) {
  const {
    rooms, resource, setResource,
    step, setStep, checkIn, checkOut, setCheckIn, setCheckOut,
    guests, setGuests, numRooms, setNumRooms,
    guestInfo, setGuestInfo, addOns, setAddOns,
    totals, submitting, error, bookingReference, onSubmit, onReset,
  } = props;

  const emailValid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestInfo.email),
    [guestInfo.email]
  );
  const step1Valid = Boolean(checkIn && checkOut && guests >= 1 && resource);
  const step2Valid = guestInfo.name.trim().length >= 2 && emailValid && guestInfo.phone.trim().length >= 7;
  const finalStep = step === 4;

  const pickResource = (r: RoomCategory) => {
    setResource(r);
    setStep(1);
  };

  const updateAddOn = (id: string, qty: number) => {
    setAddOns({ ...addOns, [id]: qty });
  };

  return (
    <div>
      {/* Room selection (step 0) */}
      <div className="mb-8">
        <p className="mb-3 text-sm font-medium text-ink">
          Choose your room or suite:
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {rooms.map((r) => (
            <button
              key={r.id}
              onClick={() => pickResource(r)}
              className={cn(
                "flex items-center gap-3 rounded-lg border p-3 text-left transition-all",
                resource?.id === r.id
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border/70 bg-card hover:border-primary/40"
              )}
            >
              <img src={r.images[0]} alt="" className="h-14 w-20 shrink-0 rounded-md object-cover" />
              <span className="min-w-0">
                <span className="block truncate font-semibold text-ink">{r.name}</span>
                <span className="block text-sm text-primary">
                  {formatNaira(r.price_per_night)}/night
                </span>
              </span>
              {resource?.id === r.id && (
                <Check className="ml-auto h-5 w-5 shrink-0 text-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Step indicator */}
      {!finalStep && (
        <div className="mb-8 flex items-center gap-2">
          {STEPS.map((s, i) => {
            const active = step === s.n;
            const done = step > s.n;
            const Icon = s.icon;
            return (
              <div key={s.n} className="flex flex-1 items-center gap-2">
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
                    active && "border-primary bg-primary text-primary-foreground",
                    done && "border-primary bg-primary/10 text-primary",
                    !active && !done && "border-border bg-card text-muted-foreground"
                  )}
                >
                  {done ? <Check className="h-4 w-4" /> : s.n}
                </div>
                <span
                  className={cn(
                    "hidden text-sm font-semibold sm:block",
                    active ? "text-ink" : "text-muted-foreground"
                  )}
                >
                  {s.label}
                </span>
                {i < STEPS.length - 1 && <div className={cn("h-px flex-1", done ? "bg-primary" : "bg-border")} />}
              </div>
            );
          })}
        </div>
      )}

      {/* STEP 1. Dates & guests */}
      {step === 1 && (
        <div className="space-y-8">
          <div>
            <h3 className="font-display text-xl font-semibold text-ink">
              Choose your dates
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Pick your check-in and check-out dates.
            </p>
            <div className="mt-5 rounded-lg border border-border/70 bg-card p-4">
              <Calendar
                mode="range"
                selected={{ from: checkIn, to: checkOut }}
                onSelect={(range) => {
                  setCheckIn(range?.from);
                  setCheckOut(range?.to);
                }}
                numberOfMonths={2}
                disabled={{ before: new Date() }}
                className="[&_.rdp-months]:justify-center"
              />
            </div>
            {!checkIn || !checkOut ? (
              <p className="mt-3 text-sm text-destructive">Please select both a start and end date.</p>
            ) : (
              <p className="mt-3 text-sm text-primary">
                {totals.units} night(s) selected
              </p>
            )}
          </div>

          <Separator />

          <div className="flex flex-wrap items-end gap-8">
            <QtyStepper label="Number of guests" value={guests} onChange={setGuests} min={1} max={100} />
            <QtyStepper label="Number of rooms" value={numRooms} onChange={setNumRooms} min={1} max={10} />
          </div>

          <div className="flex justify-end">
            <Button
              size="lg"
              onClick={() => setStep(2)}
              disabled={!step1Valid}
            >
              Continue
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2. Guest info */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h3 className="font-display text-xl font-semibold text-ink">Your details</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              We will send your booking confirmation to this email.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="guest-name">Full name</Label>
              <Input
                id="guest-name"
                placeholder="e.g. Adeola Johnson"
                value={guestInfo.name}
                onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guest-email">Email address</Label>
              <Input
                id="guest-email"
                type="email"
                placeholder="you@example.com"
                value={guestInfo.email}
                onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guest-phone">Phone number</Label>
              <Input
                id="guest-phone"
                type="tel"
                placeholder="e.g. 0803 000 0000"
                value={guestInfo.phone}
                onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                autoComplete="tel"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="guest-requests">Special requests (optional)</Label>
              <Textarea
                id="guest-requests"
                placeholder="Arrival time, dietary needs, extra pillows..."
                value={guestInfo.requests}
                onChange={(e) => setGuestInfo({ ...guestInfo, requests: e.target.value })}
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>
              <ArrowLeft className="mr-1 h-4 w-4" /> Back
            </Button>
            <Button size="lg" onClick={() => setStep(3)} disabled={!step2Valid}>
              Continue
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3. Add-ons */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h3 className="font-display text-xl font-semibold text-ink">Add-on services</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Rates vary and will be provided by a management representative. Add-on charges are not included in the room total.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {addOnServices.map((svc) => (
              <AddOnCard
                key={svc.id}
                service={svc}
                qty={addOns[svc.id] ?? 0}
                onChange={(q) => updateAddOn(svc.id, q)}
              />
            ))}
          </div>

          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setStep(2)}>
              <ArrowLeft className="mr-1 h-4 w-4" /> Back
            </Button>
            <Button
              size="lg"
              onClick={onSubmit}
              disabled={submitting}
              className="min-w-44"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Confirming...
                </>
              ) : (
                <>
                  Confirm Booking · {formatNaira(totals.total)}
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4. Confirmation */}
      {finalStep && (
        <div className="mx-auto max-w-xl rounded-lg border border-border/70 bg-card p-8 text-center sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-9 w-9 text-success" />
          </div>
          <h3 className="mt-6 font-display text-2xl font-semibold text-ink">You're all set!</h3>
          <p className="mt-2 text-muted-foreground">
            Your booking is confirmed. We have sent a confirmation to{" "}
            <strong className="text-ink">{guestInfo.email}</strong>.
          </p>

          <div className="mt-6 rounded-md bg-cream-100 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Booking reference
            </p>
            <p className="mt-1 font-display text-3xl font-semibold tracking-widest text-ink">
              {bookingReference}
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-ink">
              <PartyPopper className="h-4 w-4 text-gold-deep" />
              {resource?.name}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between rounded-md border border-border/70 px-5 py-3 text-sm">
            <span className="text-muted-foreground">Total due</span>
            <span className="font-display text-xl font-semibold text-primary">
              {formatNaira(totals.total)}
            </span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Our reception will call you shortly to arrange payment and confirm details. For urgent help, call us any hour.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="outline">
              <Link to="/">Back to Home</Link>
            </Button>
            <Button onClick={onReset}>Make Another Booking</Button>
            <Button onClick={() => window.print()}>
              <Printer className="mr-1.5 h-4 w-4" /> Print Confirmation
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
