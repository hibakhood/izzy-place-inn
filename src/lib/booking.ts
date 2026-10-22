import { supabase, isSupabaseConfigured } from "./supabase";
import type { BookingPayload } from "@/types";

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

export async function saveBooking(payload: BookingPayload): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    console.warn("[booking] Supabase not configured; booking not persisted to DB.");
    return { ok: true };
  }

  const { error } = await supabase.from("bookings").insert(payload);
  if (error) {
    console.error("[booking] save failed:", error.message);
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

/**
 * Fire-and-forget: sends both confirmation emails in the background so the
 * confirmation screen renders immediately. Never awaited by the UI.
 */
export function sendBookingEmails(payload: BookingEmailPayload): void {
  fetch("/api/send-booking-emails", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch((err) => console.warn("[booking] email background send failed:", err));
}
