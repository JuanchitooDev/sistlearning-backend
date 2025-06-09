'use strict';

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
    await queryInterface.bulkInsert('Perfil', [
      {
        nombre: "Administrador",
        nombre_url: "administrador",
        sistema: false,
        estado: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: "Estudiante",
        nombre_url: "estudiante",
        sistema: false,
        estado: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: "Instructor",
        nombre_url: "instructor",
        sistema: false,
        estado: true,
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
    await queryInterface.bulkDelete('Perfil', {
      nombre: ['Administrador', 'Estudiante', 'Instructor']
    }, {})
  }
};
