const userRoute = require('express').Router();
const rootRoute = require('express').Router();
const respond = require('../util/response');
const authenticate = require('../util/authentication');

const followerController = require('./follower');

/**
 * Return posts by id
 */
rootRoute.get('/:postId(\\d+)/',
  (req, res) => {
    DB.post.findOne({
      where: {
        id: req.params.postId
      },
      attributes: {
        exclude: ['userId']
      },
      include: [{
        model: DB.user,
        attributes: {
          exclude: ['passwordHash', 'email', 'tokenId']
        }
      }]
    }).then(post => {
      if (post) {
        respond(200, post, res);
      } else respond(404, null, res);
    }).catch(e => {
      console.log(e);
      respond(500, null, res);
    });
  });

/**
 * Create new post
 */
rootRoute.post('/',
  authenticate,
  (req, res) => {
    if (DB.post.isValid(req.body)) {
      req.body.authorId = req.user.id;
      DB.post.create(req.body).then(post => {
        respond(200, post, res);
      }).catch(e => {
        console.log(e);
        respond(500, null, res);
      });
    } else respond(400, null, res);
  });

userRoute.get('/', (req, res) => {
  let userId = req.splittedParams[2];
  DB.post.findAll({
    where: {
      authorId: userId
    },
    attributes: {
      exclude: ['userId']
    },
    include: [{
      model: DB.user,
      attributes: {
        exclude: ['passwordHash', 'email', 'tokenId']
      }
    }]
  }).then(posts => {
    respond(200, posts, res);
  }).catch(e => {
    console.log(e);
    respond(500, null, res);
  });
});

module.exports = {
  userRoute,
  rootRoute
};