const passport = require('passport');
const Strategy = require('passport-http-bearer').Strategy;
const respond = require('./response');

/**
 * Requires the token to be valid
 */
function authenticate(req, res, next) {
  if (!req.headers.authorization) {
    respond(401, null, res);
    return;
  }
  let token = req.headers.authorization;
  DB.token.findOne({
    where: {
      value: token
    },
    include: [DB.user]
  }).then(user => {
    if (!user || !user.dataValues.user) {
      respond(401, null, res);
      return;
    }
    req.user = user.dataValues.user.dataValues;
    next();
  }).catch(e => {
    console.log(e);
    respond(500, null, res);
  });
}

/**
 * Loads user information if the token is valid, else it will just continue.
 */
function loadUser(req, res, next) {
  if (!req.headers.authorization) {
    next();
    return;
  }
  let token = req.headers.authorization;
  DB.token.findOne({
    where: {
      value: token
    },
    include: [DB.user]
  }).then(user => {
    if (!user) {
      next();
      return;
    }
    req.user = user.dataValues.user.dataValues;
    next();
  }).catch(e => {
    console.log(e);
    next();
  });  
}

module.exports = {
  authenticate,
  loadUser
};