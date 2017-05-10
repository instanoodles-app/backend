const passport = require('passport');
const Strategy = require('passport-http-bearer').Strategy;
const respond = require('./response');

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

module.exports = authenticate;