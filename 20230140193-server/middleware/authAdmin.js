const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

exports.authAdmin = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token tidak disediakan." });

  jwt.verify(token, JWT_SECRET, (err, userPayload) => {
    if (err) {
      console.error("JWT Verification Error:", err.message);
      return res.status(403).json({
        message: "Token tidak valid (JWT Error).",
        error: err.message,
        hint: "Pastikan JWT_SECRET di Vercel sama dengan yang digunakan saat login."
      });
    }

    req.user = userPayload;
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      console.error("Access Denied: User role is", req.user?.role);
      return res.status(403).json({
        message: "Akses ditolak. Role Anda bukan Admin.",
        userRole: req.user?.role
      });
    }
  });
};