// routes/profile.js
const express = require("express");
const router = express.Router();
const stringSimilarity = require("string-similarity");
const { User, JobApplication, GigApplication, Job, Gig } = require("../models");
const authMiddleware = require("../middleware/auth");

// ✅ GET student applications
router.get("/:id/applications", authMiddleware, async (req, res) => {
  const studentId = parseInt(req.params.id);

  if (req.user.id !== studentId || req.user.role !== "student") {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  try {
    const jobApplications = await JobApplication.findAll({
      where: { studentId },
      include: [
        {
          model: Job,
          include: [{ model: User, attributes: ["name", "email", "company"], as: "User" }],
        },
      ],
    });

    const gigApplications = await GigApplication.findAll({
      where: { studentId },
      include: [
        {
          model: Gig,
          include: [{ model: User, attributes: ["name", "email", "company"], as: "User" }],
        },
      ],
    });

    res.json({ jobApplications, gigApplications });
  } catch (err) {
    console.error("Error fetching applications:", err);
    res.status(500).json({ message: "Failed to fetch applications." });
  }
});

// ✅ GET profile (for all authenticated users — student, employer, admin)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { id, name, email, role, company, skills, photoUrl } = user;
    res.json({ id, name, email, role, company, skills, photoUrl });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// ✅ PUT profile update (student: name + skills, employer: company info)
router.put("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "student") {
      const { name, skills } = req.body;
      user.name = name;
      user.skills = Array.isArray(skills) ? skills : [];
    } else if (user.role === "employer") {
      const { company_name, description, website, industry, location } = req.body;
      user.company_name = company_name;
      user.description = description;
      user.website = website;
      user.industry = industry;
      user.location = location;
    }

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
});

// Helper function: fuzzy skill matcher
const getMissingSkills = (studentSkills, requiredSkills) => {
  if (!studentSkills || studentSkills.length === 0) return requiredSkills;

  const missing = [];

  for (let skill of requiredSkills) {
    const { bestMatch } = stringSimilarity.findBestMatch(skill.toLowerCase(), studentSkills.map(s => s.toLowerCase()));
    if (bestMatch.rating < 0.7) {
      missing.push(skill);
    }
  }

  return missing;
};

// GET /api/upskill/ai
router.get("/ai", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }

    const student = await User.findByPk(req.user.id);
    const studentSkills = student.skills || [];

    const jobs = await Job.findAll({ where: { publish_status: "published" } });
    const gigs = await Gig.findAll({ where: { publish_status: "published" } });

    const jobsWithMissing = jobs.map((job) => {
      const requiredSkills = job.required_skills || [];
      return {
        ...job.toJSON(),
        missing_skills: getMissingSkills(studentSkills, requiredSkills),
      };
    });

    const gigsWithMissing = gigs.map((gig) => {
      const requiredSkills = gig.required_skills || [];
      return {
        ...gig.toJSON(),
        missing_skills: getMissingSkills(studentSkills, requiredSkills),
      };
    });

    return res.json({ jobs: jobsWithMissing, gigs: gigsWithMissing });
  } catch (err) {
    console.error("AI Upskill Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;
