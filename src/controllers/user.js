const route = require('express').Router();
const respond = require('../util/response');
const authenticate = require('../util/authentication');

const crypto = require('crypto');
const bcrypt = require('bcrypt');

/**
 * Get me
 */
route.get('/me/profile',
  authenticate,
  (req, res) => {
    if (req.user) {
      respond(200, filter(req.user, true), res);
    } else respond(404, null, res);
  });

function filter(user, showemail) {
  let filteredUser = {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    bioDescription: user.bioDescription,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  }

  if (showemail)
    filteredUser.email = user.email;
  return filteredUser;
}

/**
 * Return user by id
 */
route.get('/:id',
  authenticate,
  (req, res) => {
    DB.user.findOne({
      where: {
        id: req.params.id
      }
    }).then(user => {
      if (!user) {
        respond(404, null, res);
        return;
      }
      respond(200, filter(user), res);
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
      respond(500, null, res);
      console.log(e);
    });
  } else respond(400, null, res);
});

module.exports = route;