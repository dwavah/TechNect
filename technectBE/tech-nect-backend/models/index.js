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

// 1. User Model
const User = sequelize.define('User', {
  name: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true },
  password: DataTypes.STRING,
  role: DataTypes.ENUM('admin', 'student', 'employer'),
  skills: { type: DataTypes.JSON, defaultValue: [] },
  company: DataTypes.STRING,
}, {
  timestamps: true,
});

// 2. Job Model
const Job = sequelize.define('Job', {
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  company: DataTypes.STRING,
  location: DataTypes.STRING,
  required_skills: { type: DataTypes.JSON, defaultValue: [] },
  posted_by: DataTypes.INTEGER,
  deadline: DataTypes.DATE,
  status: { type: DataTypes.STRING, defaultValue: 'Open' },
  publish_status: {
    type: DataTypes.ENUM('draft', 'published'),
    defaultValue: 'draft',
  },
}, {
  timestamps: true,
});

// 3. Gig Model
const Gig = sequelize.define('Gig', {
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  company: DataTypes.STRING,
  location: DataTypes.STRING,
  required_skills: { type: DataTypes.JSON, defaultValue: [] },
  posted_by: DataTypes.INTEGER,
  publish_status: {
    type: DataTypes.ENUM('draft', 'published'),
    defaultValue: 'draft',
  },
}, {
  timestamps: true,
});

// 4. Job Application Model
const JobApplication = sequelize.define('JobApplication', {
  studentId: DataTypes.INTEGER,
  jobId: DataTypes.INTEGER,
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
}, {
  timestamps: true,
});

// 5. Gig Application Model
const GigApplication = sequelize.define('GigApplication', {
  studentId: DataTypes.INTEGER,
  gigId: DataTypes.INTEGER,
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
}, {
  timestamps: true,
});

// ------------------ ASSOCIATIONS ------------------

// Employers ↔ Jobs
User.hasMany(Job, { foreignKey: 'posted_by' });
Job.belongsTo(User, { foreignKey: 'posted_by' });

// Employers ↔ Gigs
User.hasMany(Gig, { foreignKey: 'posted_by' });
Gig.belongsTo(User, { foreignKey: 'posted_by' });

// Students ↔ Jobs
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

// Students ↔ Gigs
User.belongsToMany(Gig, {
  through: GigApplication,
  as: 'AppliedGigs',
  foreignKey: 'studentId',
  otherKey: 'gigId'
});
Gig.belongsToMany(User, {
  through: GigApplication,
  as: 'GigApplicants',
  foreignKey: 'gigId',
  otherKey: 'studentId'
});

// ------------------ EXPORT ------------------

module.exports = {
  sequelize,
  User,
  Job,
  Gig,
  JobApplication,
  GigApplication,
};
