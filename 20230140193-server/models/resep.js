'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Resep extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Resep.init({
    nama_lengkap: DataTypes.STRING,
    nomor_wa: DataTypes.STRING,
    foto_resep: DataTypes.STRING,
    keterangan: DataTypes.TEXT,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Resep',
  });
  return Resep;
};