const {
  selectArticles,
  selectArticle,
  updateArticle
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

module.exports = { getArticles, getArticle, patchArticle };
