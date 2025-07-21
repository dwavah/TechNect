const express = require("express");
const router = express.Router();
const { User, JobApplication, GigApplication, Job, Gig } = require("../models");
const authMiddleware = require("../middleware/auth");

// ✅ MOVE THIS BLOCK FIRST
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

// other routes BELOW this point
router.get("/upskill", authMiddleware, (req, res) => {
  res.json({
    suggestions: [
      "Learn Git & GitHub",
      "Explore React.js",
      "Practice MySQL queries",
      "Improve problem-solving on LeetCode",
    ],
  });
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user || user.role !== "employer") {
      return res.status(403).json({ message: "Access denied. Employers only." });
    }

    const { name, email, company_name, description, website, industry, location } = user;
    res.json({ name, email, company_name, description, website, industry, location });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user || user.role !== "employer") {
      return res.status(403).json({ message: "Access denied. Employers only." });
    }

    const { company_name, description, website, industry, location } = req.body;
    user.company_name = company_name;
    user.description = description;
    user.website = website;
    user.industry = industry;
    user.location = location;

    await user.save();
    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
});

module.exports = router;
