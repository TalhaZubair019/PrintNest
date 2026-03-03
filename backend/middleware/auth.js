const jwt = require("jsonwebtoken");

const ADMIN_EMAIL = process.env.EMAIL_USER;
const JWT_SECRET = process.env.JWT_SECRET;

function extractToken(req) {

  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  const cookieHeader = req.headers["cookie"] || "";
  const match = cookieHeader.match(/(?:^|;\s*)token=([^;]*)/);
  return match ? match[1] : null;
}

function requireAuth(req, res, next) {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    const isAdmin = req.user.isAdmin === true || req.user.email === ADMIN_EMAIL;
    if (!isAdmin) return res.status(403).json({ message: "Forbidden" });
    next();
  });
}

module.exports = {
  extractToken,
  requireAuth,
  requireAdmin,
  JWT_SECRET,
  ADMIN_EMAIL,
};
