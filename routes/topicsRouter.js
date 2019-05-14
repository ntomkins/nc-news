const topicsRouter = require('express').Router();
const { getTopics } = require('../controllers/topic-controllers.js');

topicsRouter.route('/').get(getTopics);

module.exports = topicsRouter;
