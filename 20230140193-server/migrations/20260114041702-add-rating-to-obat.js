'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Obats', 'rating', {
      type: Sequelize.FLOAT,
      defaultValue: 4.5
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Obats', 'rating');
  }
};
