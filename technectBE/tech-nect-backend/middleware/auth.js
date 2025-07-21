// middleware/auth.js
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const authenticateToken = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(403).json({ message: "User not found." });

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      company: user.company,
    }; // Attach minimal and clean user info

    next();
  } catch (err) {
    console.error("JWT Error:", err);
    res.status(400).json({ message: "Invalid Token" });
  }
};

module.exports = authenticateToken;
