const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3001;
const morgan = require("morgan");
const fs = require('fs');

// Impor router
const obatRoutes = require("./routes/obat");
const authRoutes = require("./routes/auth");
const resepRoutes = require("./routes/resep");

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Pastikan folder upload tersedia
const uploadDir = './uploads/resep';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Akses statis folder uploads
app.use('/uploads', express.static('uploads'));

// Routing API
app.use("/api/obat", obatRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/resep", resepRoutes);

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});