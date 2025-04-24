"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("reviews", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      description: { type: Sequelize.TEXT, allowNull: false },
      rating: { type: Sequelize.INTEGER, allowNull: false },
      restaurant_id: { type: Sequelize.STRING, allowNull: false },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("reviews");
  },
};
