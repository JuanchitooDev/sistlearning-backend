'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await queryInterface.bulkInsert('Pais', [
    {
      nombre: "Perú",
      nombre_url: "peru",
      estado: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      nombre: "Colombia",
      nombre_url: "colombia",
      estado: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      nombre: "Ecuador",
      nombre_url: "ecuador",
      estado: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      nombre: "Bolivia",
      nombre_url: "bolivia",
      estado: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      nombre: "Brasil",
      nombre_url: "brasil",
      estado: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      nombre: "Venezuela",
      nombre_url: "venezuela",
      estado: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      nombre: "Uruguay",
      nombre_url: "uruguay",
      estado: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      nombre: "Chile",
      nombre_url: "chile",
      estado: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
   ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Pais', {
      nombre: ['Perú', 'Colombia']
    }, {})
  }
};
