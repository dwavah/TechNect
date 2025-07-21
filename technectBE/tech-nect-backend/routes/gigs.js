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
    } = req.body;

    const newGig = await Gig.create({
      title,
      description,
      location,
      company: req.user.company,
      required_skills: required_skills || [],
      posted_by: req.user.id,
      publish_status: publish_status || "draft",
    });

    res.status(201).json(newGig);
  } catch (err) {
    console.error("Error creating gig:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ------------------ GET ALL PUBLISHED GIGS or by Employer ------------------
router.get("/", async (req, res) => {
  try {
    const { employerId } = req.query;

    const whereClause = {
      publish_status: "published",
    };

    if (employerId) {
      whereClause.posted_by = employerId;
    }

    const gigs = await Gig.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(gigs);
  } catch (err) {
    console.error("Error fetching gigs:", err);
    res.status(500).json({ message: "Failed to fetch gigs." });
  }
});

// ------------------ APPLY TO GIG ------------------
router.post("/:id/apply", authenticateToken, async (req, res) => {
  const gigId = req.params.id;
  const studentId = req.user.id;

  try {
    const gig = await Gig.findByPk(gigId);
    if (!gig) return res.status(404).json({ message: "Gig not found." });

    const existing = await GigApplication.findOne({ where: { studentId, gigId } });
    if (existing) return res.status(409).json({ message: "Already applied to this gig." });

    const application = await GigApplication.create({ studentId, gigId });
    res.status(201).json({ message: "Application submitted.", application });
  } catch (err) {
    console.error("Error applying to gig:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// ------------------ GET APPLICANTS ------------------
router.get("/:id/applicants", authenticateToken, async (req, res) => {
  const gigId = req.params.id;

  try {
    const gig = await Gig.findByPk(gigId, {
      include: {
        model: User,
        as: 'GigApplicants',
        attributes: ['id', 'name', 'email', 'skills'],
        through: { attributes: ['id', 'status'] }
      }
    });

    if (!gig) return res.status(404).json({ error: "Gig not found" });

    const applicants = gig.GigApplicants.map((applicant) => ({
      id: applicant.id,
      name: applicant.name,
      email: applicant.email,
      skills: applicant.skills,
      applicationId: applicant.GigApplication.id,
      status: applicant.GigApplication.status,
    }));

    res.json(applicants);
  } catch (err) {
    console.error("Gig applicant fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ------------------ UPDATE APPLICATION STATUS ------------------
router.put("/applications/:id/status", authenticateToken, async (req, res) => {
  const appId = req.params.id;
  const { status } = req.body;

  try {
    const application = await GigApplication.findByPk(appId);
    if (!application) return res.status(404).json({ error: "Application not found" });

    application.status = status;
    await application.save();

    res.json({ message: "Application status updated", status });
  } catch (err) {
    console.error("Update gig application status error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// UPDATE A GIG
router.put("/:id", authenticateToken, async (req, res) => {
  const gigId = req.params.id;

  try {
    const gig = await Gig.findByPk(gigId);

    if (!gig) return res.status(404).json({ message: "Gig not found." });
    if (req.user.id !== gig.posted_by) return res.status(403).json({ message: "Unauthorized." });

    const {
      title,
      description,
      location,
      required_skills,
      publish_status,
    } = req.body;

    await gig.update({
      title,
      description,
      location,
      required_skills,
      publish_status,
    });

    res.json(gig);
  } catch (err) {
    console.error("Gig update error:", err);
    res.status(500).json({ message: "Server error." });
  }
});



module.exports = router;
