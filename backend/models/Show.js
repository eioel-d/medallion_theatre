import db from "../database.js";

class Show {
  static getAll() {
    return db.prepare("SELECT * FROM shows").all();
  }

  static getById(show_id) {
    return db.prepare("SELECT * FROM shows WHERE show_id = ?").get(show_id);
  }

  static create(show) {
    const stmt = db.prepare("INSERT INTO shows (name, type) VALUES (?, ?)");
    const result = stmt.run(show.name, show.type);
    return result.lastInsertRowid;
  }

  static update(show, show_id) {
    const stmt = db.prepare(
      "UPDATE shows SET name = ?, type = ? WHERE show_id = ?",
    );
    return stmt.run(show.name, show.type, show_id);
  }

  static delete(show_id) {
    db.prepare("DELETE FROM shows WHERE show_id = ?").run(show_id);
  }
}

export default Show;
