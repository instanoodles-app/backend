const route = require('express').Router();
const respond = require('../util/response');
const authenticate = require('../util/authentication');

route.get('/',
  authenticate,
  (req, res) => {
  });

  module.exports = route;