import { email, HttpError, integer, text } from "./http.js";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ADDONS = new Set(["addon-airport-transfer", "addon-welcome-drinks", "addon-early-checkin", "addon-late-checkout"]);
function date(value: unknown, name: string) {
  const result = text(value, name, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(result) || !Number.isFinite(Date.parse(`${result}T00:00:00Z`)) || new Date(`${result}T00:00:00Z`).toISOString().slice(0,10) !== result) throw new HttpError(400, `Please check ${name}.`);
  return result;
}
export function validateBooking(body: Record<string, unknown>, key: string | null) {
  if (!key || !UUID.test(key)) throw new HttpError(400, "Please refresh the page and try again.");
  const checkIn = date(body.check_in_date, "your arrival date");
  const checkOut = date(body.check_out_date, "your departure date");
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Lagos", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  const nights = (Date.parse(checkOut) - Date.parse(checkIn)) / 86400000;
  if (checkIn < today || nights < 1 || nights > 90) throw new HttpError(400, "Choose an arrival date from today and a stay of 1 to 90 nights.");
  const selections = body.add_on_services ?? [];
  if (!Array.isArray(selections) || selections.length > 4) throw new HttpError(400, "Please check the selected services.");
  const ids = new Set<string>();
  const addons = selections.map((item: unknown) => {
    if (!item || typeof item !== "object") throw new HttpError(400, "Please check the selected services.");
    const a = item as Record<string, unknown>;
    const id = text(a.id, "the selected service", 60);
    if (!ADDONS.has(id) || ids.has(id)) throw new HttpError(400, "Please check the selected services.");
    ids.add(id);
    return { id, quantity: integer(a.quantity, "the service quantity", 20) };
  });
  return {
    request_key: key,
    room_category_id: text(body.room_category_id, "your room", 80),
    guest_name: text(body.guest_name, "your name", 120),
    guest_email: email(body.guest_email),
    guest_phone: text(body.guest_phone, "your phone number", 40),
    check_in_date: checkIn,
    check_out_date: checkOut,
    number_of_guests: integer(body.number_of_guests, "the number of guests", 40),
    number_of_rooms: integer(body.number_of_rooms, "the number of rooms", 20),
    add_on_services: addons,
    special_requests: text(body.special_requests, "your requests", 2000, true),
  };
}
