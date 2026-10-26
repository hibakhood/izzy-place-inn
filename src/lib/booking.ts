export interface EmailAddOnPayload {
  name: string;
  price: number | null;
  quantity: number;
}

export interface BookingEmailPayload {
  booking_reference: string;
  booking_type: "room";
  resource: { name: string; price: number; unit: string };
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in_date: string;
  check_out_date: string;
  number_of_guests: number;
  number_of_rooms: number;
  add_ons: EmailAddOnPayload[];
  special_requests?: string;
  subtotal: number;
  add_on_total: number;
  total_amount: number;
  booking_status: string;
  payment_status: string;
}

export interface BookingRequest {
  room_category_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in_date: string;
  check_out_date: string;
  number_of_guests: number;
  number_of_rooms: number;
  add_on_services: { id: string; quantity: number }[];
  special_requests?: string;
}

export type BookingResult =
  | { ok: true; booking_reference: string; total_amount: number }
  | { ok: false; error: string };

export async function saveBooking(payload: BookingRequest, requestKey: string, botToken: string): Promise<BookingResult> {
  try {
    const result = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Idempotency-Key": requestKey },
      body: JSON.stringify({ ...payload, bot_token: botToken }),
    });
    const data = await result.json().catch(() => null);
    if (!result.ok) {
      return { ok: false, error: typeof data?.error === "string" ? data.error : "We could not confirm your booking. Please try again or call reception." };
    }
    if (data?.ok !== true || typeof data.booking_reference !== "string" || !data.booking_reference || typeof data.total_amount !== "number" || !Number.isFinite(data.total_amount)) {
      return { ok: false, error: "We could not verify your confirmation. Please retry with the same details or call reception." };
    }
    return { ok: true, booking_reference: data.booking_reference, total_amount: data.total_amount };
  } catch {
    return { ok: false, error: "We could not reach reception. Please retry with the same details to check your booking, or call us." };
  }
}
