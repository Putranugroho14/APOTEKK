'use strict';

const Sequelize = require('sequelize');
const process = require('process');

const db = {};

// Inisialisasi Sequelize dengan DATABASE_URL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  dialectModule: require('mysql2'), // Memastikan mysql2 terpakai
  dialectOptions: {
    ssl: {
      rejectUnauthorized: true, // Wajib untuk TiDB Cloud
    }
  },
  logging: false,
});

// Import model secara manual (Eksplisit)
// Pastikan path './obat' sesuai dengan lokasi file obat.js Anda
db.obat = require('./obat')(sequelize, Sequelize.DataTypes);

// Jalankan asosiasi jika ada
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;