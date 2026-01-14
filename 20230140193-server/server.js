const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();

const app = express();

// 1. CORS - MUST BE FIRST
app.use(cors());

// 2. Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// 3. Database Initialization
const db = require("./models");

// 4. Health Check (Clean Version)
app.get("/", (req, res) => {
  res.status(200).json({
    status: "Success",
    message: "Apotek API is alive!",
    env: process.env.NODE_ENV
  });
});

// 5. Routes
const obatRoutes = require("./routes/obat");
const authRoutes = require("./routes/auth");
const resepRoutes = require("./routes/resep");

app.use("/api/obat", obatRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/resep", resepRoutes);

// Self-Healing Database Initialization (Maintain silently)
const initDB = async () => {
  try {
    const [result] = await db.sequelize.query("SHOW COLUMNS FROM Obats LIKE 'rating'");
    if (result.length === 0) {
      await db.sequelize.query("ALTER TABLE Obats ADD COLUMN rating FLOAT DEFAULT 4.5");
    }
    await db.sequelize.sync({ alter: true });
    console.log("Database initialized successfully.");
  } catch (err) {
    console.error("DB Init Error:", err.message);
  }
};

initDB();

// 6. 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint tidak ditemukan" });
});

// 7. Global Error Handler
app.use((err, req, res, next) => {
  console.error("FATAL ERROR:", err);
  res.status(500).json({
    message: "Terjadi kesalahan pada server",
    error: err.message
  });
});

module.exports = app;

// Start server if run directly (e.g. locally or on Render)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}