import express from "express";
import Ticket from "../models/Ticket.js";

const router = express.Router();

router.get("/", (req, res) => {
  const tickets = Ticket.getAll();
  res.json(tickets);
});

router.get("/patron/:patron_id", (req, res) => {
  const tickets = Ticket.getByPatron(req.params.patron_id);
  res.json(tickets);
});

router.get("/performance/:performance_id", (req, res) => {
  const tickets = Ticket.getByPerformance(req.params.performance_id);
  res.json(tickets);
});

router.get("/sold/:performance_id", (req, res) => {
  const soldSeats = Ticket.getSoldSeats(req.params.performance_id);
  res.json(soldSeats);
});

router.post("/", (req, res) => {
  const { performance_id, seat_ids, patron_id } = req.body;
  Ticket.create(performance_id, seat_ids, patron_id);
  res.status(201).json({ message: `${seat_ids.length} tickets created!` });
});

router.delete("/:id", (req, res) => {
  Ticket.delete(req.params.id);
  res.json({ message: "Ticket deleted" });
});

router.get("/:id", (req, res) => {
  const ticket = Ticket.getById(req.params.id);
  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }
  res.json(ticket);
});

export default router;
