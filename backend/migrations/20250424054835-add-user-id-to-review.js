'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('reviews', 'user_id', {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: 'users', 
        key: 'id', 
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('reviews', 'user_id');
  }
};
