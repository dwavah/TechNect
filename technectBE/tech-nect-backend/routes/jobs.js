const express = require('express');
const router = express.Router();
const { Job } = require('../models');

// Get all jobs
router.get('/', async (req, res) => {
  const jobs = await Job.findAll();
  res.json(jobs);
});

// Create job
router.post('/', async (req, res) => {
  const { title, description, company, location, required_skills, posted_by } = req.body;
  try {
    const job = await Job.create({ title, description, company, location, required_skills, posted_by });
    res.json(job);
  } catch (err) {
    res.status(400).json({ error: "Failed to create job. " + err.message });
  }
});

module.exports = router;
