const route = require('express').Router();
const respond = require('../util/response');
const authenticate = require('../util/authentication').authenticate;
const loadUser = require('../util/authentication').loadUser;
const CDN = require('../services/cdn');

const followerController = require('./follower');
const postController = require('./post').userRoute;

const crypto = require('crypto');
const bcrypt = require('bcrypt');

/**
 * Get me
 */
route.get('/me',
  authenticate,
  (req, res) => {
    if (req.user) {
      respond(200, DB.user.filter(req.user, true), res);
    } else respond(404, null, res);
  });

/**
 * Return user by id
 */
route.get('/:id(\\d+)/',
  loadUser,
  (req, res) => {
    DB.user.findOne({
      where: {
        id: req.params.id
      },
    }).then(user => {
      if (!user) {
        respond(404, null, res);
        return;
      }
      user = DB.user.filter(user);
      if (req.user) {
        DB.follower.count({
          where: {
            userId: req.user.id,
            followingId: user.id
          }
        }).then(count => {
          user.isFollowing = count === 1 ? true : false;
          respond(200, user, res);
        });
      } else respond(200, user, res);
    }).catch(e => {
      console.log(e);
      respond(500, null, res);
    });
  });

/**
 * Create new user
 */
route.post('/', (req, res) => {
  if (DB.user.isValid(req.body)) {
    Sequelize.transaction(t => {
      req.body.passwordHash = bcrypt.hashSync(req.body.password, 10);
      delete req.body.password;
      return DB.user.create(req.body, { transaction: t }).then(user => {
        const token = {
          userId: user.id,
          value: crypto.randomBytes(16).toString('hex')
        };
        return DB.token.create(token, { transaction: t });
      });
    }).then(user => {
      respond(200, user, res);
    }).catch(e => {
      if (e.original.code == '23505') {
        respond(403, null, res);
        return;
      }
      respond(500, null, res);
      console.log(e);
    });
  } else respond(400, null, res);
});

/**
 * Used to update users
 */
route.patch('/',
  authenticate,
  (req, res) => {
    let user = req.user;

    // Copy existing information
    for (let key in req.body) {
      user[key] = req.body[key];
    }
    // Shitty solution
    delete user.password;
    if (DB.user.isValid(user)) {
      DB.user.update(user, {
        where: {
          id: req.user.id
        }
      }).then(updatedUser => {
        respond(200, DB.user.filter(updatedUser), res);
      }).catch(e => {
        console.log(e);
        respond(500, null, res);
      });
    } else respond(400, null, res);
  });

/**
 * Used for authentication
 */
route.post('/authenticate', (req, res) => {
  // Validate the POST body
  if (!req.body.username || !req.body.password) {
    respond(400, null, res);
    return;
  }

  DB.user.findOne({
    where: {
      username: req.body.username
    },
    include: DB.token
  }).then(userToken => {
    if (!userToken) {
      respond(404, null, res);
      return;
    }
    // Compare the password hash with the plain text password
    bcrypt.compare(req.body.password, userToken.dataValues.passwordHash, (err, result) => {
      if (err) throw err;
      if (result) {
        // We passed, respond with the access token.
        respond(200, {
          token: userToken.dataValues.token.dataValues.value
        }, res);
      } else {
        // Access denied, send a 404
        respond(404, null, res);
      }
    });
  }).catch(e => {
    respond(500, null, res);
  });
});

route.get('/search', (req, res) => {
  if (!req.query.query) {
    respond(400, null, res);
    return;
  }

  DB.user.findAll({
    where: {
      username: {
        $like: `%${req.query.query}%`
      }
    },
    attributes: ['id', 'username', 'displayName']
  }).then(users => {
    respond(200, users, res);
  }).catch(e => {
    console.log(e);
    respond(500, null, res);
  });
});

route.use('/:id', followerController);
route.use('/:id/posts', postController);

module.exports = route;