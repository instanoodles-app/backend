const userRoute = require('express').Router();
const rootRoute = require('express').Router();
const respond = require('../util/response');
const authenticate = require('../util/authentication').authenticate;
const loadUser = require('../util/authentication').loadUser;

const likeController = require('./like');
const commentController = require('./comment');

const followerController = require('./follower');

const feedQuery = require('../util/feed');

const CDN = require('../services/cdn');

/**
 * Return posts by id
 */
rootRoute.get('/:postId(\\d+)/',
  loadUser,
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
      if (!post) {
        respond(404, null, res);
      }

      if (req.user) {
        DB.like.count({
          where: {
            userId: req.user.id,
            postId: post.id
          }
        }).then(count => {
          post.dataValues.isLiked = count === 1 ? true : false;
          respond(200, post, res);
        });
      } else respond(200, post, res);
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
    let imageKey = `${req.user.id}${req.user.username}${new Date().getTime()}${Math.random().toString(36)}`
    if (DB.post.isValid(req.body)) {
      let url = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${imageKey}`;
      req.body.authorId = req.user.id;
      req.body.imageUrl = url;
      // TODO: Upload image to Amazon S3 and save the url
      DB.post.create(req.body).then(post => {
        if (post) {
          let image = req.body.image;
          image.key = imageKey;
          CDN.uploadFile(image, (err, data) => {
            if (err) throw err;
          });
          respond(200, post, res);
        } else throw new Error('Something went wrong');
      }).catch(e => {
        console.log(e);
        respond(500, null, res);
      });
    } else respond(400, null, res);
  });

userRoute.get('/', (req, res) => {
  let userId = req.splittedParams[2] === 'me' ? req.user.id : req.splittedParams[2];
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
    }],
    order: '"createdAt" DESC'
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
      // Pretty shitty solution once again.
      DB.like.findAll({
        where: {
          userId: req.user.id
        }
      }).then(userLikes => {
        let likesMap = {};
        for (let like of userLikes) {
          likesMap[like.postId] = like;
        }
        let newFeed = [];
        for (let post of feed) {
          if (likesMap[post.id])
            post.isLiked = true;
          else post.isLiked = false;
          newFeed.push(post);
        }
        respond(200, newFeed, res);
      });
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