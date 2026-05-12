import express from "express";
import Performance from "../models/Performance.js";

const router = express.Router();

router.get("/", (req, res) => {
  const performances = Performance.getAll();
  res.json(performances);
});

router.get("/:id", (req, res) => {
  const performance = Performance.getById(req.params.id);
  if (!performance) {
    return res.status(404).json({ message: "Performance not found " });
  }
  res.json(performance);
});

router.get("/show/:show_id", (req, res) => {
  const performances = Performance.getByShow(req.params.show_id);
  res.json(performances);
});

router.post("/", (req, res) => {
  const id = Performance.create(req.body);
  res.status(201).json({ message: "Performance created", performance_id: id });
});

router.put("/:id", (req, res) => {
  Performance.update(req.params.id, req.body);
  res.json({ message: "Performance updated" });
});

router.delete("/:id", (req, res) => {
  Performance.delete(req.params.id);
  res.json({ message: "Performance deleted" });
});

export default router;

