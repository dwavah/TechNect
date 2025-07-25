// middleware/verifyToken.js
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const verifyToken = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied. No token." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) return res.status(403).json({ message: "User not found." });

    req.user = user;
    next();
  } catch (err) {
    console.error("JWT verify error:", err);
    res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = verifyToken; // ✅ MUST be exported like this
