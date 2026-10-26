import { roomsFallback } from "@/data/rooms";
import type { RoomCategory } from "@/types";

const roomSlugAliases: Record<string, string> = {
  "classic-studio": "classic-room",
  "luxury-room": "deluxe-room",
  "classic-suite": "executive-suite",
  "presidential-suite-1-bed": "executive-suite",
  "presidential-suite-2-bed": "family-room",
};

export function canonicalRoomSlug(slug: string): string {
  return roomSlugAliases[slug] ?? slug;
}

export async function getRooms(): Promise<RoomCategory[]> {
  return roomsFallback;
}

export async function getRoomBySlug(slug: string): Promise<RoomCategory | undefined> {
  const rooms = await getRooms();
  return rooms.find((r) => r.slug === canonicalRoomSlug(slug));
}
