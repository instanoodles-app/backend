const route = require('express').Router();
const respond = require('../util/response');
const authenticate = require('../util/authentication').authenticate;

// Nice hack for getting userId from route.
route.use((req, res, next) => {
  req.pathPostId = req.splittedParams[2];
  next();
});

route.get('/', (req, res) => {
  DB.like.findAll({
    where: {
      postId: req.pathPostId
    },
    include: [{
      model: DB.user,
      attributes: ['username']
    }]
  }).then(likes => {
    respond(200, likes, res);
  }).catch(e => {
    console.log(e);
    respond(500, null, res);
  });
});

route.put('/',
  authenticate,
  (req, res) => {
    const like = {
      userId: Number(req.user.id),
      postId: Number(req.pathPostId)
    };

    let check = DB.like.isValid(like);

    if (check) {
      check.then(count => {
        if (count === 1) {
          respond(403, null, res);
          return;
        }
        DB.like.create(like).then(like => {
          respond(200, like, res);
        }).catch(e => {
          console.log(e);
          respond(500, null, res);
        })
      });
    } else respond(400, null, res);
  });

route.delete('/',
  authenticate,
  (req, res) => {
    DB.like.destroy({
      where: {
        userId: req.user.id,
        postId: req.pathPostId
      }
    }).then(() => {
      respond(200, null, res);
    }).catch(e => {
      console.log(e);
      respond(500, null, res);
    });
  });

module.exports = route;