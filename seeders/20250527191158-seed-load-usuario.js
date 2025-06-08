'use strict';

const bcrypt = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    const userName = 'admin1'
    const password = 'admin1'
    const hashedPassword = await bcrypt.hash(password, 10)
    await queryInterface.bulkInsert('usuario', [
      {
        id_perfil: 1,
        username: userName,
        password: hashedPassword,
        estado: true,
        sistema: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('usuario', {
      username: ['admin1']
    })
  }
};
