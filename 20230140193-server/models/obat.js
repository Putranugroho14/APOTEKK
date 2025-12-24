'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Obat extends Model {
    static associate(models) {
      Obat.belongsTo(models.User, {
        foreignKey: 'authorId',
        as: 'Admin', // Mengubah alias dari Author ke Admin (opsional)
        onDelete: 'SET NULL',
      });
    }
  }

  Obat.init({
    nama_obat: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    stok: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    harga: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    gambar_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    kategori: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    is_published: { 
      type: DataTypes.BOOLEAN, 
      defaultValue: false 
    }
  }, {
    sequelize,
    modelName: 'Obat',
    tableName: 'obat',
    freezeTableName: true,
  });

  return Obat;
};