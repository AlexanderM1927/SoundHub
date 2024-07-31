'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('likes', {
      like_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', key: 'user_id'
        }
      },
      comment_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'comments', key: 'comment_id'
        }
      },
      playlist_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'playlists', key: 'playlist_id'
        }
      },
      sound_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'sounds', key: 'sound_id'
        }
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
    await queryInterface.dropTable('likes');
  }
};