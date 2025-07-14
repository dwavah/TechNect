require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  }
);

const User = sequelize.define('User', {
  name: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true },
  password: DataTypes.STRING,
  role: DataTypes.ENUM('admin','student', 'employer'),
  skills: { type: DataTypes.JSON, defaultValue: [] },
  company: DataTypes.STRING,
});

const Job = sequelize.define('Job', {
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  company: DataTypes.STRING,
  location: DataTypes.STRING,
  required_skills: { type: DataTypes.JSON, defaultValue: [] },
  posted_by: DataTypes.INTEGER,
});

const Gig = sequelize.define('Gig', {
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  company: DataTypes.STRING,
  location: DataTypes.STRING,
  posted_by: DataTypes.INTEGER,
});

const Application = sequelize.define('Application', {
  userId: DataTypes.INTEGER,
  jobId: DataTypes.INTEGER,
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
});

// Associations
User.hasMany(Job, { foreignKey: 'posted_by' });
Job.belongsTo(User, { foreignKey: 'posted_by' });

User.hasMany(Gig, { foreignKey: 'posted_by' });
Gig.belongsTo(User, { foreignKey: 'posted_by' });

User.belongsToMany(Job, { through: Application, foreignKey: 'userId' });
Job.belongsToMany(User, { through: Application, foreignKey: 'jobId' });

module.exports = { sequelize, User, Job, Gig, Application };
