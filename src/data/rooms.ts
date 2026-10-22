import type { RoomCategory } from "@/types";
import { hotelPhotos } from "@/data/photos";

const sharedAmenities = [
  "Full size bathroom",
  "Refrigerator",
  "Air conditioning",
  "Smart TV with international channels",
  "Free high speed Wi-Fi",
  "Regular electricity with generator and inverter backup",
];

export const roomsFallback: RoomCategory[] = [
  {
    id: "room-classic-studio",
    name: "Classic Room",
    slug: "classic-room",
    description:
      "A comfortable room with a kitchenette, a work desk and space to relax. A good choice for a short visit or a longer stay.",
    price_per_night: 25000,
    max_guests: 2,
    size_sqm: 24,
    amenities: [
      ...sharedAmenities,
      "Kitchenette",
      "Work desk",
      "Rain shower",
      "Tea & coffee station",
    ],
    images: hotelPhotos["classic-room"].map((photo) => photo.src),
    total_rooms: 8,
    featured: false,
  },
  {
    id: "room-luxury",
    name: "Deluxe Room",
    slug: "deluxe-room",
    description:
      "A spacious room with a kitchenette and private bathroom. Suitable for business trips and holidays.",
    price_per_night: 35000,
    max_guests: 2,
    size_sqm: 30,
    amenities: [
      ...sharedAmenities,
      "Kitchenette",
      "Executive work desk",
      "Rain shower",
      "Tea & coffee station",
      "Mini fridge",
    ],
    images: hotelPhotos["deluxe-room"].map((photo) => photo.src),
    total_rooms: 10,
    featured: false,
  },
  {
    id: "room-classic-suite",
    name: "Executive Suite",
    slug: "executive-suite",
    description:
      "A spacious suite with a full kitchen and a separate living area. There is room to work, relax or spend time with visitors.",
    price_per_night: 45000,
    max_guests: 2,
    size_sqm: 52,
    amenities: [
      ...sharedAmenities,
      "Full kitchen",
      "Separate living area",
      "Executive work desk",
      "Bathtub & rain shower",
      "Mini fridge",
    ],
    images: hotelPhotos["executive-suite"].map((photo) => photo.src),
    total_rooms: 6,
    featured: false,
  },
  {
    id: "room-presidential-suite-2-bed",
    name: "Family Room",
    slug: "family-room",
    description:
      "A bedroom, living area and full kitchen give your family space to spend time together.",
    price_per_night: 55000,
    max_guests: 4,
    size_sqm: 100,
    amenities: [
      ...sharedAmenities,
      "Full kitchen",
      "Living & Bedroom",
      "Airport transfer",
      "Late checkout",
    ],
    images: hotelPhotos["family-room"].map((photo) => photo.src),
    total_rooms: 1,
    featured: true,
  },
];
