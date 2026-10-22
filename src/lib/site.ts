export const siteConfig = {
  name: "Izzy Place Inn & Suites",
  shortName: "Izzy Place Inn & Suites",
  tagline: "Your Comfort, Our Priority.",
  description:
    "Izzy Place Inn & Suites offers comfortable rooms, helpful staff and a secure place to stay off Old Ife Road in Ibadan.",
  url: "https://izzyplaceinn.com",
  rooms: 25,
  phones: ["+234 703 456 0871", "+234 812 812 6923"],
  phoneDisplay: ["07034560871", "08128126923"],
  emails: { reservations: "izzyplaceinn@gmail.com", info: "info@izzyplaceinn.com" },
  address: {
    line1: "No. 21, Aromolaran Street",
    line2: "Directly opposite Floreb Hotel, off Old Ife Road",
    city: "Ibadan",
    state: "Oyo State",
    country: "Nigeria",
  },
  reception: "Open 24 hours, every day",
  mapEmbed:
    "https://www.google.com/maps?q=7.3889459,3.9279755&z=18&output=embed",
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=7.3889459%2C3.9279755",
};

export interface NavChild {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavChild[];
}

export const navLinks: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Rooms & Suites", href: "/rooms" },
  { label: "About", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];
