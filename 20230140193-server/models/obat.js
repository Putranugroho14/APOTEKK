'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class obat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  obat.init({
    nama_obat: DataTypes.STRING,
    deskripsi: DataTypes.TEXT,
    stok: DataTypes.INTEGER,
    harga: DataTypes.DECIMAL,
    gambar_url: DataTypes.STRING,
    kategori: DataTypes.STRING,
    authorId: DataTypes.INTEGER,
    is_published: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'obat',
  });
  return obat;
};