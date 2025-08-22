const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);

// demo protected route
const { requireAuth } = require("./middleware/authMiddleware");
const { requireRole } = require("./middleware/roleMiddleware");
app.get("/api/protected/admin", requireAuth, requireRole("admin"), (req, res) => {
  res.json({ msg: `Hello Admin ${req.user.name}` });
});

module.exports = app;
