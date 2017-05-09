const route = require('express').Router();

/**
 * Return user by id
 */
route.get('/:id', (req, res) => {
  DB.user.findOne({
    where: {
      id: req.params.id
    }
  }).then(user => {
    res.json(user);
  }).catch(e => {
    console.log(e);
  });
});

/**
 * Create new user
 */
route.post('/', (req, res) => {
  if (DB.user.isValid(req.body)) {
    DB.user.create(req.body).then(user => {
      res.json(user);
    }).catch(e => {
      console.log(e);
    });
  }
});

module.exports = route;