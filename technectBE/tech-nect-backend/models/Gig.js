// models/gig.js
module.exports = (sequelize, DataTypes) => {
  const Gig = sequelize.define("Gig", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    required_skills: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    publish_status: {
      type: DataTypes.ENUM("draft", "published"),
      defaultValue: "draft",
    },
    posted_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Gig.associate = (models) => {
    Gig.belongsTo(models.User, {
      foreignKey: "posted_by",
      as: "Employer",
    });

    Gig.belongsToMany(models.User, {
      through: models.GigApplication,
      as: "Applicants",
      foreignKey: "gigId",
      otherKey: "studentId",
    });
  };

  return Gig;
};
