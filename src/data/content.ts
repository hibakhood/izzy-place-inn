import type { Testimonial, GalleryImage } from "@/types";
import { hotelPhotos } from "@/data/photos";

export const testimonials: Testimonial[] = [
  {
    name: "Adaeze Nwosu",
    role: "Corporate Traveller, Lagos",
    quote:
      "The Family Room was comfortable and the staff were helpful. Check-out was quick and easy.",
    rating: 5,
  },
  {
    name: "Tunde Bakare",
    role: "Family Traveller, Ibadan",
    quote:
      "We booked two adjoining rooms for a family visit and the house made it easy. The beds were firm, the hot water was constant, and breakfast was worth the early start.",
    rating: 5,
  },
  {
    name: "Sarah Mitchell",
    role: "Long Stay Guest, UK",
    quote:
      "I stayed for three weeks for work. The room was quiet, the Wi-Fi worked well and the staff were helpful.",
    rating: 5,
  },
  {
    name: "Chinedu Okafor",
    role: "Business Traveller, Abuja",
    quote:
      "Quiet rooms, strong Wi-Fi, and the best jollof in Ibadan at their dining venue. My home base whenever I am in the city.",
    rating: 4,
  },
  {
    name: "Funmi Adeyemi",
    role: "Returning Guest",
    quote:
      "I have stayed at Izzy Place more times than I can count. The staff remember your name and your coffee order. That is what keeps me coming back.",
    rating: 5,
  },
  {
    name: "James Adebayo",
    role: "Business Traveller, Lagos",
    quote:
      "The staff were helpful throughout my stay. I would be happy to stay here again.",
    rating: 5,
  },
];

export const vision =
  "To give every guest a comfortable stay and good value.";

export const mission =
  "To welcome people from all backgrounds with comfortable rooms and friendly, helpful service.";

export const coreValues = [
  {
    name: "Comfort",
    description:
      "Comfortable beds, clean bathrooms and air conditioning help you rest well.",
  },
  {
    name: "Luxury",
    description:
      "Well kept rooms and thoughtful service make your stay more comfortable.",
  },
  {
    name: "Security",
    description:
      "Our gated property and security staff help keep you safe, day and night.",
  },
  {
    name: "Affordability",
    description:
      "Clear room rates and comfortable accommodation at a fair price.",
  },
];

export const galleryImages: GalleryImage[] = Object.entries(hotelPhotos).flatMap(([category, photos]) =>
  photos.map((photo, index) => ({
    id: `${category}-${index + 1}`,
    ...photo,
    category: category === "facilities" ? "facilities" as const : "rooms" as const,
  })),
);

export const amenitiesList = [
  {
    name: "Comfortable accommodation",
    description:
      "Comfortable rooms with space to rest, whether you stay for one night or a few weeks.",
    icon: "Bed",
  },
  {
    name: "Executive suites",
    description:
      "Our suites and family rooms offer more space for relaxing, working and longer stays.",
    icon: "Crown",
  },
  {
    name: "Free high speed Wi-Fi",
    description:
      "Free Wi-Fi in every room and throughout the building.",
    icon: "Wifi",
  },
  {
    name: "Kitchen & kitchenette",
    description:
      "Prepare meals and drinks in your room’s kitchen or kitchenette.",
    icon: "CookingPot",
  },
  {
    name: "Living & working space",
    description:
      "Space to sit, relax or catch up on work during your stay.",
    icon: "Laptop",
  },
  {
    name: "Smart TV",
    description:
      "Watch your favourite shows on a Smart TV in your room.",
    icon: "Tv",
  },
  {
    name: "Air-conditioned rooms",
    description:
      "Air conditioning keeps your room cool and comfortable.",
    icon: "Snowflake",
  },
  {
    name: "Security",
    description:
      "Security staff are on duty 24 hours a day, with controlled access to the property.",
    icon: "ShieldCheck",
  },
  {
    name: "Regular electricity",
    description:
      "A generator and inverter provide backup during power cuts.",
    icon: "Zap",
  },
  {
    name: "Concierge",
    description:
      "Help with local recommendations, directions and everyday requests to make your stay easier.",
    icon: "ConciergeBell",
  },
];
