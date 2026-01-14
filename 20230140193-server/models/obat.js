'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Obat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Obat.belongsTo(models.User, { foreignKey: 'authorId', as: 'Admin' });
    }
  }
  Obat.init({
    nama_obat: DataTypes.STRING,
    deskripsi: DataTypes.TEXT,
    stok: DataTypes.INTEGER,
    harga: DataTypes.DECIMAL,
    gambar_url: DataTypes.STRING,
    kategori: DataTypes.STRING,
    authorId: DataTypes.INTEGER,
    is_published: DataTypes.BOOLEAN,
    rating: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Obat',
  });
  return Obat;
};