import db from "../database.js";

class Patron {
  static getAll() {
    return db.prepare("SELECT * FROM patrons").all();
  }

  static getById(patron_id) {
    return db
      .prepare("SELECT * FROM patrons WHERE patron_id = ?")
      .get(patron_id);
  }

  static create(patron) {
    const stmt = db.prepare(`
      INSERT INTO patrons (first_name, last_name, address, city, state, zip, phone, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      patron.first_name,
      patron.last_name,
      patron.address,
      patron.city,
      patron.state,
      patron.zip,
      patron.phone,
      patron.email,
    );
    return result.lastInsertRowid;
  }

  static update(patron_id, patron) {
    const stmt = db.prepare(`
      UPDATE patrons
      SET first_name=?, last_name=?, address=?, city=?, state=?, zip=?, phone=?, email=?
      WHERE patron_id=?
    `);
    return stmt.run(
      patron.first_name,
      patron.last_name,
      patron.address,
      patron.city,
      patron.state,
      patron.zip,
      patron.phone,
      patron.email,
      patron_id,
    );
  }

  static delete(patron_id) {
    return db.prepare("DELET FROM patrons WHERE patron_id=?").run(patron_id);
  }
}

export default Patron
