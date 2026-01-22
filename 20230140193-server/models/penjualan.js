'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Penjualan extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Penjualan.init({
        nama_pelanggan: DataTypes.STRING,
        nomor_wa: DataTypes.STRING,
        alamat: DataTypes.TEXT,
        detail_pesanan: DataTypes.TEXT, // Stored as JSON string
        total_harga: DataTypes.DECIMAL,
        status: {
            type: DataTypes.STRING,
            defaultValue: 'Menunggu' // Menunggu, Selesai, Dibatalkan
        }
    }, {
        sequelize,
        modelName: 'Penjualan',
        tableName: 'Penjualans'
    });
    return Penjualan;
};
