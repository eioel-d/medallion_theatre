import db from "./database.js";

const seats = [];

// Orchestra: A-F, seats: 1-30, price: 65
const orchestraRows = ["A", "B", "C", "D", "E", "F"];

for (const row of orchestraRows) {
  for (let i = 1; i <= 30; i++) {
    seats.push({
      seat_number: `${row}${i}`,
      category: "orchestra",
      price: 65.0,
    });
  }
}

const mezzanineRows = ["G", "H", "I", "J", "K", "L", "M", "N"];
for (const row of mezzanineRows) {
  for (let i = 1; i <= 30; i++) {
    seats.push({
      seat_number: `${row}${i}`,
      category: "mezzanine",
      price: 55.0,
    });
  }
}

const balconyRows = ["AA", "BB", "CC"];
for (const row of balconyRows) {
  for (let i = 1; i <= 30; i++) {
    seats.push({ seat_number: `${row}${i}`, category: "balcony", price: 40.0 });
  }
}
for (let i = 1; i <= 28; i++) {
  seats.push({ seat_number: `DD${i}`, category: "balcony", price: 40.0 });
}
for (let i = 1; i <= 24; i++) {
  seats.push({ seat_number: `EE${i}`, category: "balcony", price: 40.0 });
}
for (let i = 1; i <= 24; i++) {
  seats.push({ seat_number: `FF${i}`, category: "balcony", price: 40.0 });
}

for (let i = 1; i <= 16; i++) {
  seats.push({ seat_number: `X${i}`, category: "box", price: 85.0 });
}

const stmt = db.prepare(
  "INSERT OR IGNORE INTO seats (seat_number, category, price) VALUES (?, ?, ?)",
);

let count = 0;
for (const seat of seats) {
  stmt.run(seat.seat_number, seat.seat_category, seat.seat_price);
  count++;
}

console.log(`${count} seats added successfully`);
