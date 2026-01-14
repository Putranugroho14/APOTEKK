const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();

const app = express();

// 1. CORS - MUST BE FIRST
// Using a permissive config to debug
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  credentials: true
}));

// Handle Preflight
app.options("*", cors());

// 2. Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// 3. Health Check (To verify the app is even booting)
app.get("/", (req, res) => {
  res.status(200).json({
    status: "Success",
    message: "Apotek API is alive!",
    env: process.env.NODE_ENV
  });
});

// 4. Routes
const obatRoutes = require("./routes/obat");
const authRoutes = require("./routes/auth");
const resepRoutes = require("./routes/resep");

app.use("/api/obat", obatRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/resep", resepRoutes);

// 5. Database Initialization (Non-blocking)
const db = require("./models");
db.sequelize.authenticate()
  .then(() => {
    console.log("Database connected.");
    // Sync only if needed, don't let it crash the boot
    db.sequelize.sync({ alter: true }).catch(err => console.error("Sync error:", err));
  })
  .catch(err => {
    console.error("Database connection error:", err.message);
  });

// 6. 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint tidak ditemukan" });
});

module.exports = app;