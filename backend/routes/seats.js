import express from "express";
import db from "../database.js";

const router = express.Router();

router.get("/", (req, res) => {
  const seats = db.prepare("SELECT * FROM seats").all();
  res.json(seats);
});

router.get("/category/:category", (req, res) => {
  const seats = db
    .prepare("SELECT * FROM seats WHERE category = ?")
    .all(req.params.category);
  res.json(seats);
});

router.get("/available/:performance_id", (req, res) => {
  const seats = db
    .prepare(
      `
    SELECT * FROM seats
    WHERE seat_id NOT IN (
      SELECT seat_id FROM tickets
      WHERE performance_id = ?
    )
  `,
    )
    .all(req.params.performance_id);
  res.json(seats);
});

router.get("/:id", (req, res) => {
  const seat = db
    .prepare("SELECT * FROM seats WHERE seat_id = ?")
    .get(req.params.id);
  if (!seat) {
    return res.status(404).json({ message: "Seat not found" });
  }
  res.json(seat);
});

export default router
