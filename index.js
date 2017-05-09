const express = require('express');
const app = express();

const passport = require('passport');
const Strategy = require('passport-http-bearer').Strategy;
const bodyparser = require('body-parser');

global.DB = require('./src/models');

passport.use(new Strategy((token, cb) => {
    DB.token.findOne({
      where: {
        value: token
      },
      include: [DB.user]
    }).then(user => {
      if (!user) return cb(new Error('Could not find user'));
      return cb(null, user.dataValues.user.dataValues);
    }).catch(e => {
      console.log(e);
      cb(e);
    });
  }
));

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
  passport.authenticate('bearer', { session: false }),
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