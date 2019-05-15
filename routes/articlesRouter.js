const articlesRouter = require('express').Router();
const {
  getArticles,
  getArticle,
  patchArticle
} = require('../controllers/article-controllers.js');

articlesRouter.route('/').get(getArticles);
articlesRouter
  .route('/:article_id')
  .get(getArticle)
  .patch(patchArticle);

module.exports = articlesRouter;
