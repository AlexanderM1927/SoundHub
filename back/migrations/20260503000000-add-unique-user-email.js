'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('users', {
      fields: ['user_email'],
      type: 'unique',
      name: 'unique_user_email'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('users', 'unique_user_email');
  }
};
