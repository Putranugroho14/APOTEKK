'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nama: {
        type: Sequelize.STRING,
        allowNull: false // Tambahkan agar tidak boleh kosong
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true // Tambahkan agar username tidak duplikat
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: {
        // PERBAIKAN DI SINI: Gunakan Sequelize.ENUM atau Sequelize.STRING
        type: Sequelize.ENUM('admin'), 
        defaultValue: 'admin'
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
    await queryInterface.dropTable('users');
  }
};