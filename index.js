const express = require('express');
const app = express();

const bodyparser = require('body-parser');
const cors = require('cors');

const dbLogic = require('./src/models');
global.DB = dbLogic.db;
global.Sequelize = dbLogic.sequelize;

app.use(cors());
app.use(bodyparser.json({
  limit: 10000000
}));
app.disable('x-powered-by');
app.use((req, res, next) => {
  try {
    req.splittedParams = req.path.split('/');
  } catch (e) {
    console.log(e);
  }
  next();
});

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
  console.log(err);
  res.json(err);
});

app.listen(8000, () => {
  console.log('Web server started on port 8000');
});