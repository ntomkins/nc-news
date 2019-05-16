const {
  selectArticles,
  selectArticle,
  updateArticle,
  selectArticleComments,
  insertArticleComment
} = require('../models/article-models.js');
const { selectUser } = require('../models/user-models.js');

const getArticles = (req, res, next) => {
  const author = req.query.author ? req.query.author : null;

  selectUser({ username: author })
    .then(author => {
      if (!author && req.query.author) {
        return Promise.reject({
          status: 404,
          msg: 'author does not exist'
        });
      } else return selectArticles(req.query);
    })
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

const getArticle = (req, res, next) => {
  selectArticle(req.params)
    .then(article => {
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${req.params.article_id}`
        });
      }
      res.status(200).send({ article });
    })
    .catch(next);
};

const patchArticle = (req, res, next) => {
  updateArticle(req.params, req.body).then(updatedArticle => {
    res.status(200).send({ updatedArticle: updatedArticle[0] });
  });
};

const getArticleComments = (req, res, next) => {
  selectArticleComments(req.params).then(articleComments => {
    res.status(200).send({ articleComments });
  });
};

const postArticleComment = (req, res, next) => {
  insertArticleComment(req.params, req.body).then(postedComment => {
    res.status(201).send({ postedComment: postedComment[0] });
  });
};

module.exports = {
  getArticles,
  getArticle,
  patchArticle,
  getArticleComments,
  postArticleComment
};
