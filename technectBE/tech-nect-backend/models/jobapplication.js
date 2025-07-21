// models/JobApplication.js
module.exports = (sequelize, DataTypes) => {
  const JobApplication = sequelize.define("JobApplication", {
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "denied"),
      defaultValue: "pending",
    },
  });

  return JobApplication;
};
