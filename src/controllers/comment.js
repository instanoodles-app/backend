const route = require('express').Router();
const respond = require('../util/response');
const authenticate = require('../util/authentication');

// Nice hack for getting userId from route.
route.use((req, res, next) => {
  req.pathPostId = req.splittedParams[2];
  next();
});

route.get('/', (req, res) => {
  DB.comment.findAll({
    where: {
      postId: req.pathPostId,
    },
    include: [{
      model: DB.user,
      attributes: ['username']
    }]
  }).then(comments => {
    respond(200, comments, res);
  }).catch(e => {
    console.log(e);
    respond(500, null, res);
  });
});

route.put('/',
  authenticate,
  (req, res) => {
    req.body.postId = Number(req.pathPostId);
    req.body.userId = Number(req.user.id);
    if (DB.comment.isValid(req.body)) {
      DB.comment.create(req.body).then(comment => {
        respond(200, comment, res);
      }).catch(e => {
        console.log(e);
        respond(500, null, res);
      });
    } else respond(400, null, res);
  });

route.delete('/:id',
  authenticate,
  (req, res) => {
    DB.comment.findOne({
      where: {
        id: req.params.id
      }
    }).then(comment => {
      if (!comment) {
        respond(400, null, res);
        return;
      }
      if (comment.userId === req.user.id) {
        DB.comment.destroy({
          where: {
            id: req.params.id,
            userId: req.user.id
          }
        }).then(() => {
          respond(200, null, res);
        });
      } else respond(403, null, res);
    }).catch(e => {
      console.log(e);
      respond(500, null, res);
    });
  });

module.exports = route;