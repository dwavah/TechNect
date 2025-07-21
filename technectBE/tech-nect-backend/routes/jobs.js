const express = require('express');
const router = express.Router();
const { Job, User, JobApplication } = require('../models');
const authenticateToken = require('../middleware/auth');

// ------------------ GET ALL JOBS ------------------
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.findAll({
      order: [['createdAt', 'DESC']],
    });

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

// ------------------ POST A NEW JOB ------------------
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
      publish_status: "draft",
    });

    res.status(201).json(job);
  } catch (err) {
    console.error("❌ Job creation error:", err);
    res.status(400).json({ error: "Failed to create job. " + err.message });
  }
});

// ------------------ APPLY TO A JOB ------------------
router.post('/:id/apply', authenticateToken, async (req, res) => {
  const jobId = req.params.id;
  const studentId = req.user.id;

  try {
    const job = await Job.findByPk(jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });

    const existing = await JobApplication.findOne({ where: { jobId, studentId } });
    if (existing) return res.status(400).json({ error: "Already applied" });

    await JobApplication.create({ jobId, studentId });
    res.status(200).json({ message: "Applied successfully" });
  } catch (err) {
    console.error("Apply Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ------------------ GET APPLICANTS FOR A JOB ------------------
router.get('/:id/applicants', authenticateToken, async (req, res) => {
  const jobId = req.params.id;

  try {
    const applications = await JobApplication.findAll({
      where: { jobId },
      include: {
        model: User,
        attributes: ['id', 'name', 'email', 'skills']
      }
    });

    const formatted = applications.map(app => ({
      id: app.id,
      status: app.status,
      student: app.User,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Applicant fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ------------------ APPROVE OR DENY APPLICANT ------------------
router.put('/applications/:id/status', authenticateToken, async (req, res) => {
  const appId = req.params.id;
  const { status } = req.body;

  if (!['approved', 'denied'].includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  try {
    const app = await JobApplication.findByPk(appId);
    if (!app) return res.status(404).json({ error: "Application not found" });

    app.status = status;
    await app.save();

    res.json({ message: `Application ${status}` });
  } catch (err) {
    console.error("Status update error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
