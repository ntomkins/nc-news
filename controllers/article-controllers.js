const {
  selectArticles,
  selectArticle,
  updateArticle,
  selectArticleComments,
  insertArticleComment
} = require('../models/article-models.js');

const getArticles = (req, res, next) => {
  selectArticles(req.query).then(articles => {
    res.status(200).send({ articles });
  });
};

const getArticle = (req, res, next) => {
  selectArticle(req.params).then(article => {
    res.status(200).send({ article });
  });
};

const patchArticle = (req, res, next) => {
  updateArticle(req.params, req.body).then(updatedArticle => {
    res.status(200).send({ updatedArticle });
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
