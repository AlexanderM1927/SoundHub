'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('views', {
      view_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      playlist_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'playlists', key: 'playlist_id'
        }
      },
      sound_id: {
        type: Sequelize.STRING,
        allowNull: true,
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
    await queryInterface.dropTable('views');
  }
};