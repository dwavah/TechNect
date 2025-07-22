const express = require("express");
const router = express.Router();
const { User, Job, Gig } = require("../models");
const authenticateToken = require("../middleware/auth");
const stringSimilarity = require("string-similarity");

// Helper function for fuzzy skill matching
const getMissingSkills = (studentSkills, requiredSkills) => {
  if (!studentSkills || studentSkills.length === 0) return requiredSkills;

  return requiredSkills.filter((skill) => {
    const { bestMatch } = stringSimilarity.findBestMatch(
      skill.toLowerCase(),
      studentSkills.map((s) => s.toLowerCase())
    );
    return bestMatch.rating < 0.7;
  });
};

// AI-based skill matching route
router.get("/ai", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }

    const student = await User.findByPk(req.user.id);
    const studentSkills = student.skills || [];

    const jobs = await Job.findAll({ where: { publish_status: "published" } });
    const gigs = await Gig.findAll({ where: { publish_status: "published" } });

    const jobsWithMissing = jobs.map((job) => ({
      ...job.toJSON(),
      missing_skills: getMissingSkills(studentSkills, job.required_skills || []),
    }));

    const gigsWithMissing = gigs.map((gig) => ({
      ...gig.toJSON(),
      missing_skills: getMissingSkills(studentSkills, gig.required_skills || []),
    }));

    res.json({ jobs: jobsWithMissing, gigs: gigsWithMissing });
  } catch (err) {
    console.error("AI Upskill Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
