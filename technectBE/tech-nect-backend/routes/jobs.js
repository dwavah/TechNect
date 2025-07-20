const express = require('express');
const router = express.Router();
const { Job, User, JobApplication } = require('../models');
const authenticateToken = require('../middleware/auth');

// ------------------ GET ALL JOBS (public) ------------------
router.get('/', async (req, res) => {
  try {
    // ✅ Remove employerId filtering for student/public view
    const jobs = await Job.findAll({
      order: [['createdAt', 'DESC']],
    });

    // ✅ Safely parse required_skills
    const formattedJobs = jobs.map((job) => ({
      ...job.toJSON(),
      required_skills: typeof job.required_skills === 'string'
        ? job.required_skills.split(',').map(s => s.trim())
        : job.required_skills
    }));

    res.json(formattedJobs);
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ error: "Failed to fetch jobs." });
  }
});

// ------------------ CREATE NEW JOB (protected) ------------------
router.post('/', authenticateToken, async (req, res) => {
  const { title, description, location, required_skills, deadline, status } = req.body;

  try {
    const job = await Job.create({
      title,
      description,
      location,
      required_skills: Array.isArray(required_skills)
        ? required_skills.join(',')
        : required_skills,
      deadline,
      status,
      posted_by: req.user.id,
      company: req.user.company || "Unknown Company",
      publish_status: "draft", // ✅ default; change via update if needed
    });

    res.status(201).json(job);
  } catch (err) {
    console.error("❌ Job creation error:", err);
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

    const existing = await JobApplication.findOne({
      where: { jobId, studentId }
    });
    if (existing) {
      return res.status(400).json({ error: "Already applied" });
    }

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
        attributes: ['id', 'name', 'email', 'skills'],
      }
    });

    if (!job) return res.status(404).json({ error: "Job not found" });

    res.json(job.Applicants);
  } catch (err) {
    console.error("Applicant fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
