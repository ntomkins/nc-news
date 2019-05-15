const { selectArticles } = require('../models/article-models.js');

const getArticles = (req, res, next) => {
  selectArticles(req.query).then(articles => {
    res.status(200).send({ articles });
  });
};

module.exports = { getArticles };
