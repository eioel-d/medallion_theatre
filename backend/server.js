// server.js
import express from "express";
import cors from "cors";
import db from "./database.js";
import patronRoutes from "./routes/patrons.js"

const app = express();
const PORT = 3001;

// Middleware - lets Express read JSON and talk to React
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/patrons", patronRoutes)

// A simple test route
app.get("/", (req, res) => {
  res.json({ message: "Medallion Theatre API is running!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
