'use strict';
const Sequelize = require('sequelize');
const process = require('process');

const db = {};

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  dialectModule: require('mysql2'),
  dialectOptions: {
    ssl: {
      rejectUnauthorized: true,
    }
  },
  logging: false,
});

// IMPORT MANUAL: Pastikan file 'obat.js' ada di folder yang sama
db.obat = require('./obat')(sequelize, Sequelize.DataTypes);

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;