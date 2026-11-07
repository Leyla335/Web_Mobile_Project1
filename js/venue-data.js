const VENUE = {
  name: "Azerbaijan State Academic Russian Drama Theater Hall",
  currency: "AZN",

  // The seats are divided similar to the seating sections in Russian Drama Theater Hall

  // FL - Front Left seats section
  // FR - Front Right seats section
  // BL - Back Left seats section
  // BR - Back Right seats section

  sections: [
    { id: "FL", name: "Front Left",  side: "left",  zone: "front",
      rows: ["A","B","C","D","E"], seatsPerRow: 8, firstSeat: 1,  price: 20 },
    { id: "FR", name: "Front Right", side: "right", zone: "front",
      rows: ["A","B","C","D","E"], seatsPerRow: 8, firstSeat: 9,  price: 20 },
    { id: "BL", name: "Back Left",   side: "left",  zone: "back",
      rows: ["F","G","H","I","J","K","L","M"], seatsPerRow: 9, firstSeat: 1,  price: 15 },
    { id: "BR", name: "Back Right",  side: "right", zone: "back",
      rows: ["F","G","H","I","J","K","L","M"], seatsPerRow: 9, firstSeat: 10, price: 15 }
  ],
  // seat ID format: sectionId-row-number, e.g. "FL-A-3"
  unavailable: ["FL-A-3", "FL-B-4", "FR-C-12", "BL-H-5", "BR-K-14", "BR-M-18"]
};