const GigApplication = sequelize.define('GigApplication', {
  studentId: DataTypes.INTEGER,
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
  },
}, {
  timestamps: true,
});
