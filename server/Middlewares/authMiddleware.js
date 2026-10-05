const jwt = require("jsonwebtoken");

/**
 * 1. Auth Middleware: verifyToken
 * - Verifies the JWT sent in Authorization header
 * - Decodes user payload (id, email, role, name) and attaches it to req.user
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  const token = authHeader && authHeader.startsWith("Bearer ") 
    ? authHeader.split(" ")[1] 
    : authHeader;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access Denied: No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret-123");
    req.user = {
      _id: decoded._id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role || "employee",
    };
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

/**
 * 2. Role Middleware: adminOnly
 * - Checks if req.user.role === "admin"
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access Denied: Admin role required",
    });
  }
};

/**
 * 3. Role Middleware: managerOrAdmin
 * - Checks if req.user.role === "admin" || req.user.role === "manager"
 */
const managerOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "manager")) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access Denied: Manager or Admin role required",
    });
  }
};

module.exports = {
  verifyToken,
  adminOnly,
  managerOrAdmin,
};
