import { useEffect, useState } from "react";
import { getRooms } from "@/lib/data";
import { roomsFallback } from "@/data/rooms";
import type { RoomCategory } from "@/types";

export function useRooms() {
  const [rooms, setRooms] = useState<RoomCategory[] | null>(roomsFallback);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    getRooms().then((data) => {
      if (active) {
        setRooms(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return { rooms, loading };
}
