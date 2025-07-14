const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, role, company, skills } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role, company, skills });
    res.json({ id: user.id, name, email, role, company, skills });
  } catch (err) {
    res.status(400).json({ error: "Registration failed. " + err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: "User not found" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Incorrect password" });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "2d" });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, company: user.company, skills: user.skills } });
  } catch (err) {
    res.status(400).json({ error: "Login failed. " + err.message });
  }
});

module.exports = router;
