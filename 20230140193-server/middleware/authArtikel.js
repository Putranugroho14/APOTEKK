// middleware/authObat.js
const jwt = require("jsonwebtoken");
const JWT_SECRET = 'INI_ADALAH_KUNCI_RAHASIA_ANDA_YANG_SANGAT_AMAN';

exports.authArtikel = (req, res, next) => { // Tetap gunakan nama authArtikel jika route memanggil nama ini
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token tidak disediakan." });

  jwt.verify(token, JWT_SECRET, (err, userPayload) => {
    if (err) return res.status(403).json({ message: "Token tidak valid." });

    req.user = userPayload;
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      return res.status(403).json({ message: "Akses ditolak. Hanya Admin." });
    }
  });
};