// models/user.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    name: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
    role: DataTypes.ENUM('admin', 'student', 'employer'),
    skills: { type: DataTypes.JSON, defaultValue: [] }, // ✅ Already good
    company: DataTypes.STRING,
  });

  User.associate = (models) => {
    User.hasMany(models.Job, { foreignKey: 'posted_by' });
    User.belongsToMany(models.Job, {
      through: models.JobApplication,
      as: 'AppliedJobs',
      foreignKey: 'studentId',
      otherKey: 'jobId'
    });
  };

  return User;
};
