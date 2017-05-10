const express = require('express');
const app = express();

const bodyparser = require('body-parser');

const dbLogic = require('./src/models');
global.DB = dbLogic.db;
global.Sequelize = dbLogic.sequelize;

app.use(bodyparser.json());

/**
 * Load controllers
 */

const userController = require('./src/controllers/user');

/**
 * Register controllers
 */
app.use(
  '/users', 
  userController
);

/**
 * Error handler
 */
app.use((err, req, res, next) => {
  res.json(err);
});

app.listen(8000, () => {
  console.log('Web server started on port 8000');
});