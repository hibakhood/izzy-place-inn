import type { DiningVenue, Testimonial, GalleryImage } from "@/types";
import { asset } from "@/lib/utils";

export const testimonials: Testimonial[] = [
  {
    name: "Adaeze Nwosu",
    role: "Corporate Traveller, Lagos",
    quote:
      "The Presidential Suite 2 Bed is genuinely the finest stay I have had in Ibadan. Service was discreet, food excellent, and check-out took all of a minute.",
    rating: 5,
  },
  {
    name: "Tunde Bakare",
    role: "Wedding Guest, Ibadan",
    quote:
      "We hosted my daughter's wedding in the Lekan Are Hall and the Kakanfo team handled everything — décor, sound, catering — without a single hitch. Our guests are still talking about it.",
    rating: 5,
  },
  {
    name: "Sarah Mitchell",
    role: "Conference Organiser, UK",
    quote:
      "The Allied Hall is world class. Reliable Wi-Fi, crisp AV, and a team that made our two day summit run like clockwork. Highly recommend.",
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
      "I have stayed at Kakanfo Inn more times than I can count. The staff remember your name and your coffee order — that is what keeps me coming back.",
    rating: 5,
  },
  {
    name: "James Adebayo",
    role: "Event Host, Lagos",
    quote:
      "From the boardroom for the morning meeting to the Bawa Continent Garden for the evening reception, the whole day flowed perfectly. Outstanding venue.",
    rating: 5,
  },
];

export const vision =
  "To create and sustain a memorable experience that delivers value to all guests at all times";

export const mission =
  "To deliver a world class experience that attracts people of diverse cultures, in a vibrant environment provided by committed team members";

export const coreValues = [
  { name: "Responsiveness", description: "We answer quickly and act promptly — every guest concern is met with a ready, willing response." },
  { name: "Integrity", description: "We keep our word, deal fairly, and run an honest house that guests can rely on." },
  { name: "Consistency", description: "The same warm welcome and exacting standard, whether it is your first visit or your hundredth." },
  { name: "Excellence", description: "We pursue world class quality in every room, every plate, and every event we host." },
];

export const historyMilestones = [
  {
    year: "1988",
    title: "The house opens",
    text: "Operations begin at our registered office on 1 Nihinlola Street with forty-two rooms.",
  },
  {
    year: "1999",
    title: "Growing with the city",
    text: "The inn expands to eighty-two rooms to keep pace with Ibadan's rising business travel.",
  },
  {
    year: "2018",
    title: "Ninety-five rooms",
    text: "A major expansion delivers ninety-five beautifully crafted modern rooms.",
  },
  {
    year: "2022",
    title: "World-class halls",
    text: "Multipurpose halls with a modern kitchen and a large cold storage facility join the property.",
  },
];

export const chairman = {
  name: "Adedamola Are",
  title: "Chairman & CEO",
  role: "Kakanfo Inn & Conference Centre · Kakanfo Enterprises Limited",
  image: asset("/images/facilities/chairman.jpg"),
  education: [
    "Bachelor of Arts, Public Administration — Michigan State University, East Lansing",
    "Bachelor's degree in Hotel Administration — University of Nevada, Las Vegas, 1987",
    "Executive Studies — Harvard Business School, Massachusetts, 2018",
  ],
  career: [
    "Manager and later General Manager, Marriott Hotels across four brands — Courtyard, Fairfield, Residence Inn and Marriott Vacation Club International (California to Colorado, 1989–2002).",
    "Senior Director of Resort Operations, and later Senior Director of Global Guest Initiatives, Hilton Grand Vacations, Orlando (2005).",
    "Regional Vice President, Mastercorp Incorporated, Crossville, Tennessee (2008).",
    "Vice President of Resort Operations, Legacy Vacation Club, Orlando (2009–2012).",
  ],
  closing:
    "Today he is Executive Chairman and Chief Executive Officer of Kakanfo Enterprises Ltd, Ibadan. Born in 1966 and educated at Government College Ibadan, Adedamola Are holds several awards and commendations, has served on several boards, and has authored two books — one alongside Dr. Are.",
};

export const hostedEvents = [
  "Annual General Meetings",
  "Award Nights",
  "Birthday Celebrations",
  "Conferences",
  "Conventions",
  "Exhibitions",
  "Product Launches",
  "Public Lectures",
  "Seminars",
  "Trade Fairs",
  "Weddings / Wedding Receptions",
  "Workshops",
];

export const conferenceCentreIntro =
  "Kakanfo Conference Centre is a purpose built facility designed to host events of any size.";

export const diningVenues: DiningVenue[] = [
  {
    name: "Bisi Restaurant",
    description:
      "A full-service restaurant serving a la carte Nigerian, Indian, Chinese, Lebanese, European and American cuisine — from smoky jollof to an international menu prepared to order.",
    cuisine: "International à la carte",
    hours: "6:30am – 10:30pm",
    image: asset("/images/facilities/bisi-restaurant.jpg"),
  },
  {
    name: "Funke Pool Bar",
    description:
      "Assorted fast foods and beverages served poolside — burgers, grills, cold drinks and the easy, unhurried pace of the pool deck.",
    cuisine: "Fast food & beverages",
    hours: "10:00am – 11:00pm",
    image: asset("/images/facilities/pool-bar.jpg"),
  },
  {
    name: "Bawa Continent Garden",
    description:
      "Designed to host cocktail and barbecue themed parties — an open air garden venue that comes alive as the evening sets in.",
    cuisine: "Cocktails & barbecue",
    hours: "By arrangement",
    image: asset("/images/halls/awero-garden.jpg"),
  },
];

export const galleryImages: GalleryImage[] = [
  { id: "g1", src: asset("/images/rooms/classic-studio-1.jpg"), alt: "Classic Studio", category: "rooms" },
  { id: "g2", src: asset("/images/rooms/classic-studio-2.jpg"), alt: "Classic Studio", category: "rooms" },
  { id: "g3", src: asset("/images/rooms/classic-studio-3.jpg"), alt: "Classic Studio", category: "rooms" },
  { id: "g4", src: asset("/images/rooms/classic-suite-1.jpg"), alt: "Classic Suite", category: "rooms" },
  { id: "g5", src: asset("/images/rooms/luxury-room-hero.jpg"), alt: "Luxury Room", category: "rooms" },
  { id: "g6", src: asset("/images/rooms/luxury-room-1.jpg"), alt: "Luxury Room", category: "rooms" },
  { id: "g7", src: asset("/images/rooms/luxury-room-2.jpg"), alt: "Luxury Room", category: "rooms" },
  { id: "g8", src: asset("/images/rooms/luxury-room-3.jpg"), alt: "Luxury Room", category: "rooms" },
  { id: "g9", src: asset("/images/rooms/luxury-room-4.jpg"), alt: "Luxury Room", category: "rooms" },
  { id: "g10", src: asset("/images/rooms/luxury-room-5.jpg"), alt: "Luxury Room", category: "rooms" },
  { id: "g11", src: asset("/images/rooms/presidential-1-bed-1.jpg"), alt: "Presidential Suite 1 Bed", category: "rooms" },
  { id: "g12", src: asset("/images/rooms/presidential-1-bed-2.jpg"), alt: "Presidential Suite 1 Bed", category: "rooms" },
  { id: "g13", src: asset("/images/rooms/presidential-1-bed-3.jpg"), alt: "Presidential Suite 1 Bed", category: "rooms" },
  { id: "g14", src: asset("/images/rooms/presidential-2-bed-1.jpg"), alt: "Presidential Suite 2 Bed", category: "rooms" },
  { id: "g15", src: asset("/images/rooms/presidential-2-bed-2.jpg"), alt: "Presidential Suite 2 Bed", category: "rooms" },
  { id: "g16", src: asset("/images/rooms/presidential-2-bed-3.jpg"), alt: "Presidential Suite 2 Bed", category: "rooms" },
  { id: "g17", src: asset("/images/rooms/presidential-2-bed-4.jpg"), alt: "Presidential Suite 2 Bed", category: "rooms" },
  { id: "g18", src: asset("/images/facilities/pool-bar.jpg"), alt: "Funke Pool Bar", category: "facilities" },
  { id: "g18b", src: asset("/images/facilities/swimming-pool.jpg"), alt: "Swimming Pool", category: "facilities" },
  { id: "g19", src: asset("/images/facilities/lobby.jpg"), alt: "Hotel Lobby", category: "facilities" },
  { id: "g20", src: asset("/images/facilities/guest-lobby.jpg"), alt: "Guest Lobby", category: "facilities" },
  { id: "g21", src: asset("/images/facilities/reception-1.jpg"), alt: "Reception", category: "facilities" },
  { id: "g22", src: asset("/images/facilities/reception-2.jpg"), alt: "Reception", category: "facilities" },
  { id: "g23", src: asset("/images/facilities/spa.jpg"), alt: "Lola Spa", category: "facilities" },
  { id: "g24", src: asset("/images/facilities/spa-2.jpg"), alt: "Lola Spa", category: "facilities" },
  { id: "g25", src: asset("/images/facilities/gym.jpg"), alt: "Fitness Studio", category: "facilities" },
  { id: "g26", src: asset("/images/facilities/restaurant-1.jpg"), alt: "Bisi Restaurant", category: "facilities" },
  { id: "g27", src: asset("/images/facilities/restaurant-2.jpg"), alt: "Bisi Restaurant", category: "facilities" },
  { id: "g28", src: asset("/images/facilities/restaurant-3.jpg"), alt: "Bisi Restaurant", category: "facilities" },
  { id: "g29", src: asset("/images/facilities/coffee-bar.png"), alt: "O' Coffee Bar", category: "facilities" },
  { id: "g30", src: asset("/images/facilities/exterior-1.jpg"), alt: "Hotel Exterior", category: "facilities" },
  { id: "g31", src: asset("/images/facilities/exterior-2.jpg"), alt: "Hotel Exterior", category: "facilities" },
  { id: "g32", src: asset("/images/halls/allied-hall-1.jpg"), alt: "Allied Hall", category: "events" },
  { id: "g33", src: asset("/images/halls/allied-hall-2.jpg"), alt: "Allied Hall", category: "events" },
  { id: "g34", src: asset("/images/halls/allied-hall-3.jpg"), alt: "Allied Hall", category: "events" },
  { id: "g35", src: asset("/images/halls/allied-hall-4.jpg"), alt: "Allied Hall", category: "events" },
  { id: "g36", src: asset("/images/halls/allied-conference.jpg"), alt: "Allied Hall Conference", category: "events" },
  { id: "g37", src: asset("/images/halls/awero-garden.jpg"), alt: "Bawa Continent Garden", category: "events" },
  { id: "g38", src: asset("/images/halls/ayo-boardroom-1.jpg"), alt: "Ayo Boardroom", category: "events" },
  { id: "g39", src: asset("/images/halls/ayo-boardroom-2.jpg"), alt: "Ayo Boardroom", category: "events" },
  { id: "g40", src: asset("/images/halls/damola-hall.jpg"), alt: "Damola Hall", category: "events" },
  { id: "g41", src: asset("/images/halls/lekan-are-hall-1.jpg"), alt: "Lekan Are Hall", category: "events" },
  { id: "g42", src: asset("/images/halls/lekan-are-hall-2.jpg"), alt: "Lekan Are Hall", category: "events" },
  { id: "g43", src: asset("/images/halls/mojisola-hall-1.jpg"), alt: "Mojisola Hall", category: "events" },
  { id: "g44", src: asset("/images/halls/mojisola-hall-2.jpg"), alt: "Mojisola Hall", category: "events" },
  { id: "g45", src: asset("/images/halls/nihinlola-hall.jpg"), alt: "Nihinlola Hall", category: "events" },
  { id: "g46", src: asset("/images/halls/vip-hall-1.jpg"), alt: "VIP Hall", category: "events" },
  { id: "g47", src: asset("/images/halls/vip-hall-2.jpg"), alt: "VIP Hall", category: "events" },
  { id: "g48", src: asset("/images/halls/vip-hall-3.jpg"), alt: "VIP Hall", category: "events" },
];

export const amenitiesList = [
  { name: "Outdoor pool", description: "A landscaped pool and sun deck open all day.", icon: "Waves" },
  { name: "Fitness studio", description: "Modern equipment, open 6am to 10pm.", icon: "Dumbbell" },
  { name: "Spa & wellness", description: "Massage, steam and wellness therapies.", icon: "Flower" },
  { name: "Free high speed Wi-Fi", description: "Reliable fibre connection in every room and venue.", icon: "Wifi" },
  { name: "Business centre", description: "Printing, secretarial and meeting support.", icon: "Briefcase" },
  { name: "24/7 security", description: "Gated grounds with round-the-clock personnel.", icon: "ShieldCheck" },
  { name: "Free parking", description: "Secure on site parking for guests and visitors.", icon: "ParkingSquare" },
  { name: "Restaurants & bar", description: "Three dining venues across the grounds.", icon: "UtensilsCrossed" },
  { name: "24-hour room service", description: "Dining delivered to your room, any hour.", icon: "BellRing" },
  { name: "Event & conference facilities", description: "From boardrooms to the 2,000 guest Lekan Are Hall.", icon: "Presentation" },
  { name: "Laundry & dry cleaning", description: "Same day pressing service.", icon: "Shirt" },
  { name: "Concierge", description: "Tours, transfers and local know-how.", icon: "ConciergeBell" },
];
