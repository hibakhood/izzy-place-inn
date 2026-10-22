import { asset } from "@/lib/utils";

// Uploaded hotel photographs, grouped by the room named in each source file.
export const hotelPhotos = {
  "classic-room": [
    { src: asset("/images/rooms/classic-room-view-4.jpg"), alt: "Classic room view 4" },
    { src: asset("/images/rooms/classic-room-view-2.jpg"), alt: "Classic room view 2" },
    { src: asset("/images/rooms/classic-room-view-3.jpg"), alt: "Classic room view 3" },
    { src: asset("/images/rooms/classic-room.jpg"), alt: "Classic room" },
    { src: asset("/images/rooms/classic-kitchen.jpg"), alt: "Classic Kitchen" },
    { src: asset("/images/rooms/classic-bathroom.jpg"), alt: "Classic bathroom" },
    { src: asset("/images/rooms/classic-toilet.jpg"), alt: "Classic Toilet" },
  ],
  "deluxe-room": [
    { src: asset("/images/rooms/deluxe-view-3.jpg"), alt: "Deluxe view 3" },
    { src: asset("/images/rooms/deluxe-view-1.jpg"), alt: "Deluxe view 1" },
    { src: asset("/images/rooms/delux-kitchen.jpg"), alt: "Deluxe kitchen" },
    { src: asset("/images/rooms/deluxe-kitchen.jpg"), alt: "Deluxe kitchen" },
    { src: asset("/images/rooms/deluxe-bathroom.jpg"), alt: "Deluxe Bathroom" },
  ],
  "executive-suite": [
    { src: asset("/images/rooms/executive-suite-view-3.jpg"), alt: "Executive Suite view 3" },
    { src: asset("/images/rooms/executive-suite-view-2.jpg"), alt: "Executive suite view 2" },
    { src: asset("/images/rooms/executive-suite-view.jpg"), alt: "Executive suite view" },
    { src: asset("/images/rooms/executive-suite-kitchen-2.jpg"), alt: "Executive suite kitchen 2" },
    { src: asset("/images/rooms/executive-bathroom.jpg"), alt: "Executive Bathroom" },
    { src: asset("/images/rooms/executive-bathroom-2.jpg"), alt: "Executive Bathroom 2" },
    { src: asset("/images/rooms/executive-suite-toilet.jpg"), alt: "Executive Suite toilet" },
  ],
  "family-room": [
    { src: asset("/images/rooms/family-bedroom.jpg"), alt: "Family Bedroom" },
    { src: asset("/images/rooms/family-living-room-2.jpg"), alt: "Family Living room 2" },
    { src: asset("/images/rooms/family-living-room.jpg"), alt: "Family Living room" },
    { src: asset("/images/rooms/family-kitchen.jpg"), alt: "Family Kitchen" },
    { src: asset("/images/rooms/family-kitchen-2.jpg"), alt: "Family kitchen 2" },
    { src: asset("/images/rooms/family-bathroom.jpg"), alt: "Family Bathroom" },
  ],
  "facilities": [
    { src: asset("/images/facilities/outdoor-image.jpg"), alt: "Outdoor Image" },
    { src: asset("/images/facilities/outdoor-2.jpg"), alt: "Outdoor 2" },
    { src: asset("/images/facilities/lobby.jpg"), alt: "Lobby" },
    { src: asset("/images/facilities/lobby-1.jpg"), alt: "Lobby 1" },
    { src: asset("/images/facilities/lobby-3.jpg"), alt: "Lobby 3" },
  ],
};
