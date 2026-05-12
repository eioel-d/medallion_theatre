import db from "../database.js";

class Ticket {
  static getAll() {
    return db
      .prepare(
        `
      SELECT
        tickets.*,
        patrons.first_name,
        patrons.last_name,
        seats.seat_number,
        seats.category,
        seats.price,
        performances.date,
        performances.time,
        shows.name as show_name
      FROM tickets
      JOIN patrons ON tickets.patron_id = patrons.patron_id
      JOIN seats ON tickets.seat_id = seats.seat_id
      JOIN performances ON tickets.performance_id = performances.performance_id
      JOIN shows ON performances.production_id = shows.show_id
    `,
      )
      .all();
  }

  static getById(ticket_id) {
    return db
      .prepare(
        `
      SELECT
        tickets.*,
        patrons.first_name,
        patrons.last_name,
        seats.seat_number,
        seats.category,
        seats.price,
        performances.date,
        performances.time,
        shows.name as show_name
      FROM tickets
      JOIN patrons ON tickets.patron_id = patrons.patron_id
      JOIN seats ON tickets.seat_id = seats.seat_id
      JOIN performances ON tickets.performance_id = performances.performance_id
      JOIN shows ON performances.production_id = shows.show_id
      WHERE ticket_id = ?
    `,
      )
      .get(ticket_id);
  }

  static getByPatron(patron_id) {
    return db
      .prepare(
        `
      SELECT
        tickets.*,
        seats.seat_number,
        seats.category,
        seats.price,
        performances.date,
        performances.time,
        shows.name as show_name
      FROM tickets
      JOIN seats ON tickets.seat_id = seats.seat_id
      JOIN performances ON tickets.performance_id = performances.performance_id
      JOIN shows ON performances.production_id = shows.show_id
    `,
      )
      .all(patron_id);
  }

  static getByPerformance(performance_id) {
    return db
      .prepare(
        `
      SELECT
        tickets.*,
        seats.seat_number,
        seats.category,
        seats.price,
        patrons.first_name,
        patrons.last_name
      FROM tickets
      JOIN seats ON ticket.seat_id = seats.seat_id
      JOIN paatrons ON tickets.patron_id patrons.patron_id
      WHERE tickets.performance_id = ?
    `,
      )
      .all(performance_id);
  }

  static getSoldSeats(performance_id) {
    return db
      .prepare(
        `
      SELECT seat_id FROM tickets WHERE performance_id = ? 
    `,
      )
      .all(performance_id);
  }

  static create(ticket) {
    const stmt = db.prepare(`
      INSERT INTO tickets (performance_id, seat_id, patron_id, purchase_date)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(
      ticket.performance_id,
      ticket.seat_id,
      ticket.patron_id,
      new Date().toISOString(),
    );
    return result.lastInsertRowid;
  }

  static delete(ticket_id) {
    return db.prepare("DELETE FROM tickets WHERE ticket_id = ?").run(ticket_id);
  }
}

export default Ticket;

