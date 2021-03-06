const articlesRouter = require('express').Router();
const { methodNotAllowed } = require('../errors');
const {
  getArticles,
  getArticle,
  patchArticle,
  getArticleComments,
  postArticleComment
} = require('../controllers/article-controllers.js');

articlesRouter
  .route('/')
  .get(getArticles)
  .all(methodNotAllowed);

articlesRouter
  .route('/:article_id')
  .get(getArticle)
  .patch(patchArticle)
  .all(methodNotAllowed);

articlesRouter
  .route('/:article_id/comments')
  .get(getArticleComments)
  .post(postArticleComment)
  .all(methodNotAllowed);

module.exports = articlesRouter;
