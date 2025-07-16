module.exports = (sequelize, DataTypes) => {
  const Job = sequelize.define("Job", {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    location: { type: DataTypes.STRING },
    required_skills: { type: DataTypes.TEXT },
    deadline: { type: DataTypes.DATEONLY },
    status: {
      type: DataTypes.ENUM("published", "draft"),
      defaultValue: "published",
    },
    posted_by: { type: DataTypes.INTEGER, allowNull: false },
  });

  Job.associate = (models) => {
    Job.belongsTo(models.User, { foreignKey: 'posted_by' });
    Job.belongsToMany(models.User, {
      through: models.JobApplication,
      as: 'Applicants',
      foreignKey: 'jobId',
      otherKey: 'studentId'
    });
  };

  return Job;
};
