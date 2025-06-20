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
        nombre: 'Documento Nacional de Identidad',
        nombre_url: 'documento-nacional-de-identidad',
        abreviatura: 'DNI',
        longitud: 8,
        en_persona: true,
        en_empresa: false,
        compra: false,
        venta: false
      },
      {
        nombre: 'Carnét de extranjería',
        nombre_url: 'carnet-de-extranjeria',
        abreviatura: 'CE',
        longitud: 13,
        en_persona: true,
        en_empresa: false,
        compra: false,
        venta: false
      },
      {
        nombre: 'CÉDULA',
        nombre_url: 'cedula',
        abreviatura: 'CED',
        longitud: 13,
        en_persona: true,
        en_empresa: false,
        compra: false,
        venta: false
      },
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
      abreviatura: ['DNI', 'CE', 'CED']
    }, {})
  }
};
