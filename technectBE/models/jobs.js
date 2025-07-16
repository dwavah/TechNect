// models/job.js
module.exports = (sequelize, DataTypes) => {
  const Job = sequelize.define("Job", {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    location: { type: DataTypes.STRING },
    required_skills: { type: DataTypes.TEXT }, // comma-separated
    deadline: { type: DataTypes.DATEONLY },
    status: {
      type: DataTypes.ENUM("published", "draft"),
      defaultValue: "published",
    },
    posted_by: { type: DataTypes.INTEGER, allowNull: false }, // employer user ID
  });

  return Job;
};
