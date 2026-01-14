const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

exports.authAdmin = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token tidak disediakan." });

  jwt.verify(token, JWT_SECRET, (err, userPayload) => {
    if (err) {
      console.error("JWT Verification Error:", err.message);
      return res.status(403).json({ message: "Token tidak valid.", error: err.message });
    }

    req.user = userPayload;
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      return res.status(403).json({ message: "Akses ditolak. Hanya Admin." });
    }
  });
};