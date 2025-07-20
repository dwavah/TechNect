// technectBE/routes/gigs.js
const express = require('express');
const router = express.Router();
const { Gig } = require('../models');

// ------------------ GET GIGS ------------------
router.get('/', async (req, res) => {
  try {
    const { employerId } = req.query;

    const whereClause = employerId ? { posted_by: parseInt(employerId) } : {};

    const gigs = await Gig.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json(gigs);
  } catch (err) {
    console.error("Error fetching gigs:", err.message);
    res.status(500).json({ error: "Failed to fetch gigs" });
  }
});

// ------------------ POST GIG ------------------
router.post('/', async (req, res) => {
  const { title, description, company, location, posted_by } = req.body;
  try {
    const gig = await Gig.create({
      title,
      description,
      company,
      location,
      posted_by,
      publish_status: "draft", // Default status
      required_skills: [],     // Default skills
    });
    res.json(gig);
  } catch (err) {
    res.status(400).json({ error: "Failed to create gig. " + err.message });
  }
});

// ------------------ UPDATE GIG ------------------
router.put("/:id", async (req, res) => {
  try {
    const gig = await Gig.findByPk(req.params.id);
    if (!gig) return res.status(404).json({ error: "Gig not found" });
    await gig.update(req.body);
    res.json(gig);
  } catch (err) {
    res.status(500).json({ error: "Failed to update gig. " + err.message });
  }
});

// ------------------ DELETE GIG ------------------
router.delete("/:id", async (req, res) => {
  try {
    const gig = await Gig.findByPk(req.params.id);
    if (!gig) return res.status(404).json({ error: "Gig not found" });
    await gig.destroy();
    res.json({ message: "Gig deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete gig. " + err.message });
  }
});

module.exports = router;
