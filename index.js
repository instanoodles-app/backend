const express = require('express');
const app = express();

const bodyparser = require('body-parser');
const cors = require('cors');

const dbLogic = require('./src/models');
global.DB = dbLogic.db;
global.Sequelize = dbLogic.sequelize;

app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded());
app.use((req, res, next) => {
  try {
    req.splittedParams = req.path.split('/');
  } catch (e) {
    console.log(e);
  }
  next();
});
app.disable('x-powered-by');

/**
 * Load controllers
 */

const userController = require('./src/controllers/user');
const postController = require('./src/controllers/post').rootRoute;

/**
 * Register controllers
 */
app.use(
  '/users', 
  userController
);

app.use(
  '/posts',
  postController
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