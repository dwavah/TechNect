// routes/gigs.js
const express = require("express");
const router = express.Router();
const { Gig, GigApplication, User } = require("../models");
const authenticateToken = require("../middleware/auth");

// ------------------ CREATE NEW GIG ------------------
router.post("/", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Only employers can post gigs." });
    }

    const {
      title,
      description,
      location,
      required_skills,
      publish_status,
      company // ← Accept company from request body
    } = req.body;

    const newGig = await Gig.create({
      title,
      description,
      location,
      required_skills: required_skills || [],
      publish_status: publish_status || "draft",
      company, // ← Store company in DB
      posted_by: req.user.id,
    });

    res.status(201).json(newGig);
  } catch (error) {
    console.error("Error creating gig:", error);
    res.status(500).json({ message: "Failed to create gig." });
  }
});

module.exports = router;
