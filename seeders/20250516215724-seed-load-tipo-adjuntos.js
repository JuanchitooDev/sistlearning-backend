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
    await queryInterface.bulkInsert('TipoAdjuntos', [
      {
        nombre: "PDF",
        nombre_url: "pdf",
        estado: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: "IMG",
        nombre_url: "img",
        estado: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: "VIDEO",
        nombre_url: "video",
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
    await queryInterface.bulkDelete('TipoAdjuntos', {
      nombre: ["PDF", "IMG", "VIDEO"]
    })
  }
};
