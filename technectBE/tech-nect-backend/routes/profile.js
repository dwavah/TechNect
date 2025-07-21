// routes/profile.js
const express = require("express");
const router = express.Router();
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

module.exports = router;
