// routes/gigs.js
const express = require("express");
const router = express.Router();
const { Gig } = require("../models");
const authenticateToken = require("../middleware/auth");

// POST a new gig
router.post("/", authenticateToken, async (req, res) => {
  try {
    const {
      title,
      description,
      company,
      location,
      required_skills,
      posted_by,
    } = req.body;

    const newGig = await Gig.create({
      title,
      description,
      company,
      location,
      required_skills: required_skills || [],
      posted_by,
      publish_status: "published", // Force publish
    });

    res.status(201).json(newGig);
  } catch (err) {
    console.error("Error creating gig:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET all published gigs for students
router.get("/", async (req, res) => {
  try {
    const gigs = await Gig.findAll({
      where: { publish_status: "published" }, // Only show published gigs
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(gigs);
  } catch (err) {
    console.error("Error fetching gigs:", err);
    res.status(500).json({ message: "Failed to fetch gigs." });
  }
});

module.exports = router;
