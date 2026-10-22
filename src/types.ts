export interface RoomCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  price_per_night: number;
  max_guests: number;
  size_sqm: number;
  amenities: string[];
  images: string[];
  total_rooms: number;
  featured: boolean;
}

export interface AddOnService {
  id: string;
  name: string;
  description: string;
  price: number | null;
  category: "transport" | "dining" | "amenities" | "wellness" | "other";
  icon: string;
  available: boolean;
}

export interface AddOnSelection {
  id: string;
  quantity: number;
}

export type BookingType = "room";

export interface BookingPayload {
  booking_type: BookingType;
  room_category_id?: string | null;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in_date: string;
  check_out_date: string;
  number_of_guests: number;
  number_of_rooms: number;
  add_on_services: AddOnSelection[];
  special_requests?: string;
  total_amount: number;
  payment_status: string;
  booking_status: string;
  booking_reference: string;
}

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  rating: number;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: "rooms" | "facilities";
}

export interface DiningVenue {
  name: string;
  description: string;
  image: string;
  cuisine: string;
  hours: string;
}
