const articlesRouter = require('express').Router();
const {
  getArticles,
  getArticle,
  patchArticle,
  getArticleComments
} = require('../controllers/article-controllers.js');

articlesRouter.route('/').get(getArticles);

articlesRouter
  .route('/:article_id')
  .get(getArticle)
  .patch(patchArticle);

articlesRouter.route('/:article_id/comments').get(getArticleComments);

module.exports = articlesRouter;
