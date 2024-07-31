'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Comments', {
      comment_id: {
        type: DateType.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      comment_msg: {
        type: DateType.STRING
      },
      user_id: {
        type: DateType.INTEGER
      },
      playlist_id: {
        type: DateType.INTEGER
      },
      sound_id: {
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
    await queryInterface.dropTable('Comments');
  }
};