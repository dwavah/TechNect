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

// ------------------ MODELS ------------------

const User = sequelize.define('User', {
  name: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true },
  password: DataTypes.STRING,
  role: DataTypes.ENUM('admin', 'student', 'employer'),
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
  deadline: DataTypes.STRING,
  status: { type: DataTypes.STRING, defaultValue: 'Open' },
});

const Gig = sequelize.define('Gig', {
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  company: DataTypes.STRING,
  location: DataTypes.STRING,
  posted_by: DataTypes.INTEGER,
});

const JobApplication = sequelize.define('JobApplication', {
  studentId: DataTypes.INTEGER,
  jobId: DataTypes.INTEGER,
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
});

// ------------------ ASSOCIATIONS ------------------

// Employers and Jobs
User.hasMany(Job, { foreignKey: 'posted_by' });
Job.belongsTo(User, { foreignKey: 'posted_by' });

// Employers and Gigs
User.hasMany(Gig, { foreignKey: 'posted_by' });
Gig.belongsTo(User, { foreignKey: 'posted_by' });

// Many-to-Many: Users apply to Jobs
User.belongsToMany(Job, {
  through: JobApplication,
  as: 'AppliedJobs',
  foreignKey: 'studentId',
  otherKey: 'jobId'
});

Job.belongsToMany(User, {
  through: JobApplication,
  as: 'Applicants',
  foreignKey: 'jobId',
  otherKey: 'studentId'
});

// ------------------ EXPORT ------------------

module.exports = {
  sequelize,
  User,
  Job,
  Gig,
  JobApplication
};
