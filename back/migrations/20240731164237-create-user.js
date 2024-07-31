'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      user_id: {
        type: DateType.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_identify: {
        type: DateType.STRING
      },
      user_email: {
        type: DateType.STRING
      },
      user_password: {
        type: DateType.STRING
      },
      user_name: {
        type: DateType.STRING
      },
      user_country: {
        type: DateType.STRING
      },
      user_phone: {
        type: DateType.STRING
      },
      role_id: {
        type: DateType.INTEGER
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
    await queryInterface.dropTable('Users');
  }
};