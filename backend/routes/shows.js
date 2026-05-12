import express from "express";
import Show from "../models/Show.js";

const router = express.Router()

router.get("/", (req, res) => {
  const shows = Show.getAll();
  res.json(shows);
});

router.get("/:id", (req, res) => {
  const show = Show.getById(req.params.id);
  if (!show) {
    return res.status(404).json({ message: "Show not found" });
  }
  res.json(show);
});

router.post("/", (req, res) => {
  const id = Show.create(req.body);
  res.status(201).json({ message: "Show created", show_id: id });
});

router.put("/:id", (req, res) => {
  Show.update(req.params.id, req.body);
  res.json({ message: "Show updates" });
});

router.delete("/:id", (req, res) => {
  Show.delete(req.params.id);
  res.json({ message: "Show deleted" });
});

export default router;
