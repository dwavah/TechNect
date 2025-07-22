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

// ✅ GET all gigs (for students or anyone)
router.get("/", async (req, res) => {
  try {
    const gigs = await Gig.findAll({
      where: { publish_status: "published" }, // Optional: filter published
      order: [["createdAt", "DESC"]],
    });
    res.json(gigs);
  } catch (err) {
    console.error("Error fetching gigs:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


// ✅ Get a single gig by ID
router.get("/:id", async (req, res) => {
  try {
    const gig = await Gig.findByPk(req.params.id);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }
    res.json(gig);
  } catch (err) {
    console.error("Get gig by ID error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;
