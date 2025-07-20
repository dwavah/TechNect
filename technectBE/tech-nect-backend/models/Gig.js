// models/Gig.js
module.exports = (sequelize, DataTypes) => {
  const Gig = sequelize.define("Gig", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    company: {
      type: DataTypes.STRING,
    },
    location: {
      type: DataTypes.STRING,
    },
    required_skills: {
      type: DataTypes.JSON, // Or DataTypes.ARRAY(DataTypes.STRING) for Postgres
      defaultValue: [],
    },
    posted_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    publish_status: {
      type: DataTypes.STRING,
      defaultValue: "published",
    },
    // You can optionally add 'status' if needed later
  });

  return Gig;
};
