import { supabase, isSupabaseConfigured } from "./supabase";
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

async function fetchAll<T>(table: string): Promise<T[] | null> {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase.from(table).select("*").order("created_at", { ascending: true });
  if (error) {
    console.warn(`[izzy-place] supabase fetch ${table} failed:`, error.message);
    return null;
  }
  return (data as T[]) ?? null;
}

export async function getRooms(): Promise<RoomCategory[]> {
  const remote = await fetchAll<RoomCategory>("room_categories");
  if (!remote?.length) return roomsFallback;
  // Present the same four categories when an existing database still uses
  // the previous names. Retain the source ID used for booking persistence.
  return roomsFallback.flatMap((category) => {
    const matches = remote.filter((room) => canonicalRoomSlug(room.slug) === category.slug);
    if (!matches.length) return [];
    const primary = matches.find((room) => room.id === category.id) ?? matches[0];
    return [{ ...primary, name: category.name, description: category.description, slug: category.slug, price_per_night: category.price_per_night, images: category.images, amenities: category.amenities }];
  });
}

export async function getRoomBySlug(slug: string): Promise<RoomCategory | undefined> {
  const rooms = await getRooms();
  return rooms.find((r) => r.slug === canonicalRoomSlug(slug));
}
