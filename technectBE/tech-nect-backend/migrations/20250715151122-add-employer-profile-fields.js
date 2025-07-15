"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.addColumn("Users", "company_name", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("Users", "description", {
        type: Sequelize.TEXT,
        allowNull: true,
      }),
      queryInterface.addColumn("Users", "website", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("Users", "industry", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("Users", "location", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.removeColumn("Users", "company_name"),
      queryInterface.removeColumn("Users", "description"),
      queryInterface.removeColumn("Users", "website"),
      queryInterface.removeColumn("Users", "industry"),
      queryInterface.removeColumn("Users", "location"),
    ]);
  },
};
