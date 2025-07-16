module.exports = (sequelize, DataTypes) => {
  const JobApplication = sequelize.define("JobApplication", {
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    jobId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending",
    },
  });

  return JobApplication;
};
