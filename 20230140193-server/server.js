const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();

const app = express();

// 1. CORS - MUST BE FIRST
app.use(cors({
  origin: function (origin, callback) {
    callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  credentials: true
}));

// 2. Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// 3. Database Initialization
const db = require("./models");

// 4. Health Check with DB Diagnostics
app.get("/", async (req, res) => {
  let dbStatus = "Unknown";
  let dbError = null;
  let tables = [];

  try {
    await db.sequelize.authenticate();
    dbStatus = "Connected";

    // Check if tables exist
    const [results] = await db.sequelize.query("SHOW TABLES");
    tables = results.map(r => Object.values(r)[0]);

    // Check Obat table structure specifically
    try {
      const [columns] = await db.sequelize.query("DESCRIBE Obats");
      db.obats_structure = columns;
    } catch (e) {
      db.obats_structure = "Table 'Obats' not found or error: " + e.message;
    }

  } catch (err) {
    dbStatus = "Failed";
    dbError = err.message;
  }

  res.status(200).json({
    status: "Success",
    message: "Apotek API Diagnostics",
    database: {
      status: dbStatus,
      error: dbError,
      found_tables: tables,
      obats_table: db.obats_structure
    },
    env: process.env.NODE_ENV,
    time: new Date().toISOString()
  });
});

// 5. Routes
const obatRoutes = require("./routes/obat");
const authRoutes = require("./routes/auth");
const resepRoutes = require("./routes/resep");

app.use("/api/obat", obatRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/resep", resepRoutes);

// Self-Healing Database Initialization
const initDB = async () => {
  try {
    const [result] = await db.sequelize.query("SHOW COLUMNS FROM Obats LIKE 'rating'");
    if (result.length === 0) {
      console.log("Healing: Adding 'rating' column to Obats table...");
      await db.sequelize.query("ALTER TABLE Obats ADD COLUMN rating FLOAT DEFAULT 4.5");
    }
    await db.sequelize.sync({ alter: true });
    console.log("Database synced successfully.");
  } catch (err) {
    console.error("Self-healing error:", err.message);
  }
};

initDB();

// 6. 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint tidak ditemukan" });
});

// 7. Global Error Handler (Catch-all for 500s)
app.use((err, req, res, next) => {
  console.error("FATAL ERROR:", err);
  res.status(500).json({
    message: "Terjadi kesalahan pada server",
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

module.exports = app;