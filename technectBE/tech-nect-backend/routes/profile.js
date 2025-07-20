// GET /api/profile/upskill
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
