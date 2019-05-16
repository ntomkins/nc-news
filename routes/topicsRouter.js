const topicsRouter = require('express').Router();
const { methodNotAllowed } = require('../errors');
const { getTopics } = require('../controllers/topic-controllers.js');

topicsRouter
  .route('/')
  .get(getTopics)
  .all(methodNotAllowed);

module.exports = topicsRouter;
