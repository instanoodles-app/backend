const Sequelize = require('sequelize');
const FS = require('fs');
const path = require('path');
require('dotenv').config();

function loadModels() {
  const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: 'postgres'
    }
  );

  var db = {};

  FS.readdirSync(__dirname)
    .filter(file => {
      return file.indexOf('.') !== 0 && file !== 'index.js';
    }).forEach(file => {
      let model = sequelize.import(path.join(__dirname, file));
      db[model.name] = model;
    });


  for (let o in db) {
    db[o].initTables();
  }

  for (let o in db) {
    db[o].associate(db);
  }
  return {
    db,
    sequelize
  };
}

module.exports = loadModels();