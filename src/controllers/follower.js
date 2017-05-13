const route = require('express').Router();
const respond = require('../util/response');
const authenticate = require('../util/authentication');

// Nice hack for getting userId from route.
route.use((req, res, next) => {
  req.pathUserId = req.splittedParams[2];
  next();
});

route.get('/',
  authenticate,
  (req, res) => {
    DB.follower.findAll({
      where: {
        user2: req.pathUserId
      },
      include: DB.user
    }).then(followers => {
      let arr = [];
      for (let i = 0; i < followers.length; i++) {
        arr[i] = DB.user.filter(followers[i]);
      }
      respond(200, arr, res);
    }).catch(e => {
      respond(500, null, res);
      console.log(e);
    });
  });

  module.exports = route;