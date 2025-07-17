// routes/admin.js
const express = require("express");
const router = express.Router();
const { User, Job, Gig } = require("../models");
const authenticateToken = require("../middleware/auth"); // ✅ Add this
const verifyToken = require("../middleware/verifyToken");
const isAdmin = require("../middleware/isAdmin");




router.get("/users", authenticateToken, isAdmin, async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

router.get("/jobs", authenticateToken, isAdmin, async (req, res) => {
  const jobs = await Job.findAll();
  res.json(jobs);
});

router.get("/gigs", authenticateToken, isAdmin, async (req, res) => {
  const gigs = await Gig.findAll();
  res.json(gigs);
});

router.delete("/users/:id", authenticateToken, isAdmin, async (req, res) => {
  const deleted = await User.destroy({ where: { id: req.params.id } });
  res.json({ success: !!deleted });
});

module.exports = router;
