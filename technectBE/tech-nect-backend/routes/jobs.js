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

// routes/jobs.js
router.post('/:id/apply', async (req, res) => {
  const { studentId } = req.body;
  const jobId = req.params.id;

  try {
    const job = await Job.findByPk(jobId);

    if (!job) return res.status(404).json({ error: "Job not found" });

    let applicants = job.applicants || [];

    if (applicants.includes(studentId)) {
      return res.status(400).json({ error: "Already applied" });
    }

    applicants.push(studentId);

    await Job.update({ applicants }, { where: { id: jobId } });

    res.status(200).json({ message: "Applied successfully" });
  } catch (err) {
    console.error("Apply Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
