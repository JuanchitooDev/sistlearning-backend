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
    await queryInterface.bulkInsert('TipoDocumentos', [
      {
        nombre: 'REGISTRO ÚNICO DE CONTRIBUYENTE',
        abreviatura: 'RUC',
        longitud: 11,
        en_persona: false,
        en_empresa: true,
        compra: true,
        venta: true
      },
      {
        nombre: "OTROS",
        abreviatura: "OTROS",
        longitud: 15,
        en_persona: true,
        en_empresa: false,
        compra: false,
        venta: false
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
    await queryInterface.bulkDelete('TipoDocumentos', {
      abreviatura: ['RUC', 'OTROS']
    }, {})
  }
};
