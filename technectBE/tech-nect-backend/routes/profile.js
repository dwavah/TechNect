// routes/profile.js
const express = require("express");
const router = express.Router();
const { User } = require("../models");
const authMiddleware = require("../middleware/auth");

// GET employer profile
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user || user.role !== "employer") {
      return res.status(403).json({ message: "Only employers can access this." });
    }
    const { company_name, description, website, industry, location } = user;
    res.json({ company_name, description, website, industry, location });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// UPDATE employer profile
router.put("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user || user.role !== "employer") {
      return res.status(403).json({ message: "Only employers can update this." });
    }

    const { company_name, description, website, industry, location } = req.body;
    user.company_name = company_name;
    user.description = description;
    user.website = website;
    user.industry = industry;
    user.location = location;

    await user.save();

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});

module.exports = router;
