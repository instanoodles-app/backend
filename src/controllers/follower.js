const route = require('express').Router();
const respond = require('../util/response');
const authenticate = require('../util/authentication').authenticate;
const loadUser = require('../util/authentication').loadUser;

// Nice hack for getting userId from route.
route.use((req, res, next) => {
  req.pathUserId = req.splittedParams[2];
  next();
});

route.get('/followers',
  loadUser,
  (req, res) => {
    Sequelize.query('select * from followers inner join users on (users.id = followers."userId") where "followingId" = :uid', {
      replacements: { uid: req.pathUserId === 'me' ? req.user.id : req.pathUserId },
      type: Sequelize.QueryTypes.SELECT
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

route.get('/following',
  (req, res) => {
    Sequelize.query('select * from followers inner join users on (users.id = followers."followingId") where "userId" = :uid', {
      replacements: { uid: req.pathUserId === 'me' ? req.user.id : req.pathUserId },
      type: Sequelize.QueryTypes.SELECT
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

route.put('/followers',
  authenticate,
  (req, res) => {
    if (req.pathUserId == req.user.id) {
      respond(403, null, res);
      return;
    }
    const follower = {
      userId: req.user.id,
      followingId: req.pathUserId
    };

    DB.follower.create(follower).then(follower => {
      respond(200, follower, res);
    }).catch(e => {
      console.log(e);
      respond(500, null, res);
    });
  });

route.delete('/followers',
  authenticate,
  (req, res) => {
    if (req.pathUserId == req.user.id) {
      respond(403, null, res);
      return;
    }
    DB.follower.destroy({
      where: {
        userId: req.user.id,
        followingId: req.pathUserId
      }
    }).then(() => {
      respond(200, null, res);
    }).catch(e => {
      console.log(e);
      respond(500, null, res);
    });
  });

module.exports = route;