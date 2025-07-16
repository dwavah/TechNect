const express = require('express');
const router = express.Router();
const { Job, User, JobApplication } = require('../models');

// ------------------ GET ALL JOBS ------------------
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.findAll();
    res.json(jobs);
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ error: "Failed to fetch jobs." });
  }
});

// ------------------ CREATE NEW JOB ------------------
router.post('/', async (req, res) => {
  const {
    title,
    description,
    location,
    required_skills,
    deadline,
    status,
    posted_by,
  } = req.body;

  try {
    const job = await Job.create({
      title,
      description,
      location,
      required_skills,
      deadline,
      status,
      posted_by,
    });
    res.status(201).json(job);
  } catch (err) {
    console.error("Job creation error:", err);
    res.status(400).json({ error: "Failed to create job. " + err.message });
  }
});

// ------------------ APPLY TO JOB ------------------
router.post('/:id/apply', async (req, res) => {
  const jobId = req.params.id;
  const { studentId } = req.body;

  try {
    const job = await Job.findByPk(jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });

    // Check if application already exists
    const existing = await JobApplication.findOne({
      where: { jobId, studentId }
    });
    if (existing) {
      return res.status(400).json({ error: "Already applied" });
    }

    // Create new application
    await JobApplication.create({ jobId, studentId });
    res.status(200).json({ message: "Applied successfully" });
  } catch (err) {
    console.error("Apply Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ------------------ GET APPLICANTS FOR A JOB ------------------
router.get('/:id/applicants', async (req, res) => {
  const jobId = req.params.id;

  try {
    const job = await Job.findByPk(jobId, {
      include: {
        model: User,
        as: 'Applicants',
        through: { attributes: [] },
        attributes: ['id', 'name', 'email', 'university', 'skills'],
      }
    });

    if (!job) return res.status(404).json({ error: "Job not found" });

    res.json(job.Applicants); // renamed alias for clarity
  } catch (err) {
    console.error("Applicant fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
