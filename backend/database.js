// database.js
import Database from "better-sqlite3";

const db = new Database("medallion.db");

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS patrons (
    patron_id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    address TEXT,
    city TEXT,
    state TEXT,
    zip TEXT,
    phone TEXT,
    email TEXT
  );

  CREATE TABLE IF NOT EXISTS shows (
    show_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS performances (
    performance_id INTEGER PRIMARY KEY AUTOINCREMENT,
    production_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    FOREIGN KEY (production_id) REFERENCES shows(show_id)
  );

  CREATE TABLE IF NOT EXISTS seats(
    seat_id INTEGER PRIMARY KEY AUTOINCREMENT,
    seat_number TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    price REAL NOT NULL
  );

  CREATE TABLE IF NOT EXISTS tickets (
    ticket_id INTEGER PRIMARY KEY AUTOINCREMENT,
    performance_id INTEGER NOT NULL,
    seat_id INTEGER NOT NULL,
    patron_id INTEGER NOT NULL,
    purchase_date TEXT NOT NULL,
    FOREIGN KEY (performance_id) REFERENCES performances(performance_id),
    FOREIGN KEY (seat_id) REFERENCES seats(seat_id),
    FOREIGN KEY (patron_id) REFERENCES patrons(patron_id)
  );

`);

console.log("Database and Tables Ready");

export default db;
