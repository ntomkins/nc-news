const articlesRouter = require('express').Router();
const { getArticles } = require('../controllers/article-controllers.js');

articlesRouter.route('/').get(getArticles);

module.exports = articlesRouter;
