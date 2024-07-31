'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Views', {
      view_id: {
        type: DateType.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      playlist_id: {
        type: DateType.INTEGER
      },
      sound_id: {
        type: Sequelize.STRING
      },
      view_type: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Views');
  }
};