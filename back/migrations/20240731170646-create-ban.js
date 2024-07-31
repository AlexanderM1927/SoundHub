'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bans', {
      ban_id: {
        type: DateType.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DateType.INTEGER
      },
      responsable_user_id: {
        type: DateType.INTEGER
      },
      ban_reason: {
        type: DateType.STRING
      },
      ban_expires: {
        type: DateType.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Bans');
  }
};