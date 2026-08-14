const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  let token = req.header("Authorization");

  if (!token) return res.status(401).json({ msg: "No token provided" });

  // Clean up "Bearer " prefix if present
  if (token.startsWith("Bearer ")) {
    token = token.slice(7).trim();
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified.role && verified.id) {
      const u = await User.findById(verified.id).select("role").lean();
      if (u) verified.role = u.role || "user";
    }
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Session expired or Invalid token. Please log in again." });
  }
};