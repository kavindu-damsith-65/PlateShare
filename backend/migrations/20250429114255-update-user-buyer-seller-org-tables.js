"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "name", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn("users", "profile_picture", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.removeColumn("buyer_details", "name");
    await queryInterface.removeColumn("seller_details", "name");
    await queryInterface.removeColumn("org_details", "name");

    await queryInterface.removeColumn("org_details", "profile_picture");
    await queryInterface.removeColumn("buyer_Details", "profile_picture");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "name");
    await queryInterface.removeColumn("users", "profile_picture");

    await queryInterface.addColumn("buyer_details", "name", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn("seller_details", "name", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn("org_details", "name", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn("org_details", "name", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("buyer_details", "name", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
