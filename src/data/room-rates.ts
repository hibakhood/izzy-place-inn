// Shared public catalog. Only the server calculates booking request totals.
export const roomRates: Record<string, { name: string; price: number; maxGuests: number; maxRooms: number }> = {
  'room-classic-studio': {name:'Classic Room',price:25000,maxGuests:2,maxRooms:8},
  'room-luxury': {name:'Deluxe Room',price:35000,maxGuests:2,maxRooms:10},
  'room-classic-suite': {name:'Executive Suite',price:45000,maxGuests:2,maxRooms:6},
  'room-presidential-suite-2-bed': {name:'Family Room',price:55000,maxGuests:4,maxRooms:1},
};
