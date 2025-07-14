const express = require('express');
const router = express.Router();
const { Gig } = require('../models');

router.get('/', async (req, res) => {
  const gigs = await Gig.findAll();
  res.json(gigs);
});

router.post('/', async (req, res) => {
  const { title, description, company, location, posted_by } = req.body;
  try {
    const gig = await Gig.create({ title, description, company, location, posted_by });
    res.json(gig);
  } catch (err) {
    res.status(400).json({ error: "Failed to create gig. " + err.message });
  }
});

module.exports = router;
