const userRoute = require('express').Router();
const rootRoute = require('express').Router();
const respond = require('../util/response');
const authenticate = require('../util/authentication');

const likeController = require('./like');
const commentController = require('./comment');

const followerController = require('./follower');

const feedQuery = require('../util/feed');

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
        attributes: ['username']
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
      // TODO: Upload image to Amazon S3 and save the url
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
      attributes: ['username']
    }]
  }).then(posts => {
    respond(200, posts, res);
  }).catch(e => {
    console.log(e);
    respond(500, null, res);
  });
});

rootRoute.get('/feed',
  authenticate,
  (req, res) => {
    Sequelize.query(feedQuery, {
      replacements: { uid: req.user.id },
      type: Sequelize.QueryTypes.SELECT
    }).then(feed => {
      respond(200, feed, res);
    }).catch(e => {
      console.log(e);
      respond(500, null, res);
    });
  });

rootRoute.use('/:id/likes', likeController);
rootRoute.use('/:id/comments', commentController);

module.exports = {
  userRoute,
  rootRoute
};