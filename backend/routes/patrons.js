import express from "express"
import Patron from "../models/Patron.js"

const router = express.Router()

// get all patrons
router.get("/", (req, res) => {
  const patrons = Patron.getAll()
  res.json(patrons)
})

// get a single patron
router.get("/:id", (req, res) => {
  const patron = Patron.getById(req.params.id)
  if(!patron) {
    return res.status(404).json({ message: "Patron not found" })
  }
  res.json(patron)
})

router.post("/", (req, res) => {
  const id = Patron.create(req.body);
  res.status(201).json({ message: "Patron created", patron_id: id })
})

router.put("/:id", (req, res) => {
  Patron.update(req.params.id, req.body)
  res.json({ message: "Patron updated"})
})

router.delete("/:id", (req, res) => {
  Patron.delete(req.params.id)
  res.json({ message: "Patron deleted" })
})

export default router
