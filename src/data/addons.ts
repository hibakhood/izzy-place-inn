import type { AddOnService } from "@/types";

export const addOnServices: AddOnService[] = [
  { id: "addon-airport-transfer", name: "Airport Transfer", description: "Arrange a pickup or drop-off at Ibadan Airport.", price: null, category: "transport", icon: "Plane", available: true },
  { id: "addon-welcome-drinks", name: "Welcome Drinks", description: "Request a welcome drink when you arrive.", price: null, category: "dining", icon: "GlassWater", available: true },
  { id: "addon-early-checkin", name: "Early Check-in", description: "Request an earlier arrival time. Subject to availability and confirmation by management.", price: null, category: "amenities", icon: "Clock", available: true },
  { id: "addon-late-checkout", name: "Late Checkout", description: "Request a later departure time. Subject to availability and confirmation by management.", price: null, category: "amenities", icon: "Moon", available: true },
];

export function getAddOnById(id: string): AddOnService | undefined {
  return addOnServices.find((s) => s.id === id);
}
