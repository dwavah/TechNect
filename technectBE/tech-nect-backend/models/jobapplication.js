// models/jobapplication.js
module.exports = (sequelize, DataTypes) => {
  const JobApplication = sequelize.define("JobApplication", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    jobId: { type: DataTypes.INTEGER, allowNull: false },
    studentId: { type: DataTypes.INTEGER, allowNull: false },
  });

  return JobApplication;
};
