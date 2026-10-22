import { useEffect, useState } from "react";
import { getRooms } from "@/lib/data";
import type { RoomCategory } from "@/types";

export function useRooms() {
  const [rooms, setRooms] = useState<RoomCategory[] | null>(null);
  const [loading, setLoading] = useState(true);

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
