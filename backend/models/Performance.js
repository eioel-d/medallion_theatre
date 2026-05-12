import db from "../database.js";

class Performance {
  static getAll() {
    return db
      .prepare(
        `
      SELECT performances.*, shows.name as show_name
      FROM performances
      JOIN shows ON performances.production_id = shows.show_id
      `,
      )
      .all();
  }

  static getById(performance_id) {
    return db
      .prepare(
        `
      SELECT performances.*, shows.name as show_name
      FROM performances
      JOIN shows ON performances.production_id = shows.show_id
      WHERE performance_id = ?
    `,
      )
      .get(performance_id);
  }

  static create(performance) {
    const stmt = db.prepare(`
      INSERT INTO performances (production_id, date, time) VALUES (?, ?, ?)`);
    const result = stmt.run(
      performance.production_id,
      performance.date,
      performance.time,
    );
    return result.lastInsertRowid;
  }

  static update(performance_id, performance) {
    const stmt = db.prepare(`
      UPDATE performances
      SET production_id = ?, date = ?, time = ?
      WHERE performance_id = ?
    `);
    return stmt.run(
      performance.production_id,
      performance.production_date,
      performance.production_time,
      performance_id,
    );
  }

  static delete(performance_id) {
    return db
      .prepare("DELETE FROM performances WHERE performance_id = ?")
      .run(performance_id);
  }
}

export default Performance;

