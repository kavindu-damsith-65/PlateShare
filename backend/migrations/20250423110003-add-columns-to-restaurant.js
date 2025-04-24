'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('restaurants', 'image', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('restaurants', 'description', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('restaurants', 'image');
    await queryInterface.removeColumn('restaurants', 'description');
  }
};
