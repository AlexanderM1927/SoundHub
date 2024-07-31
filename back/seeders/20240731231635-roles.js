'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('roles', [
      {
        role_id: 1,
        role_name: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role_id: 2,
        role_name: "moderator",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role_id: 3,
        role_name: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
