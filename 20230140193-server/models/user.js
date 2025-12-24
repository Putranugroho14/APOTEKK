// models/User.js

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // PERBAIKAN DI SINI:
      // Pastikan memanggil models.Obat (sesuai dengan modelName di file obat.js)
      User.hasMany(models.Obat, {
        foreignKey: 'authorId', 
        as: 'obats', 
        onDelete: 'SET NULL', 
      });
    }
  }
  
  User.init({
    nama: { 
      type: DataTypes.STRING,
      allowNull: false
    },
    username: { 
      type: DataTypes.STRING,
      allowNull: false,
      unique: true 
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin'), 
      allowNull: false,
      defaultValue: 'admin'
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users', 
  });
  return User;
};