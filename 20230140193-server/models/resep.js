'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Resep extends Model {
    static associate(models) {
      // Tidak ada relasi wajib untuk saat ini
    }
  }

  Resep.init({
    nama_lengkap: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    nomor_wa: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    foto_resep: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'diproses', 'selesai'),
      defaultValue: 'pending',
    }
  }, {
    sequelize,
    modelName: 'Resep',
    tableName: 'reseps',
    underscored: true, // Menggunakan created_at & updated_at
    timestamps: true,
  });

  return Resep;
};