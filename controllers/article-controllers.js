const {
  selectArticles,
  selectArticle,
  updateArticle,
  selectArticleComments,
  insertArticleComment
} = require('../models/article-models.js');
const { selectUser } = require('../models/user-models.js');
const { selectTopics } = require('../models/topic-models.js');

const getArticles = (req, res, next) => {
  const author = req.query.author ? req.query.author : null;

  selectUser({ username: author })
    .then(author => {
      if (!author && req.query.author) {
        return Promise.reject({
          status: 404,
          msg: 'author does not exist'
        });
      } else return selectTopics(req.query);
    })
    .then(topics => {
      if (req.query.topic) {
        if (topics.some(topic => topic.slug === req.query.topic) === false)
          return Promise.reject({ status: 404, msg: 'topic does not exist' });
      }
      return selectArticles(req.query);
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
  if (!Object.keys(req.body).includes('inc_votes')) {
    next({ status: 400, msg: 'request must include inc_votes' });
  } else if (Object.keys(req.body).length > 1) {
    next({ status: 400, msg: 'request must only include inc_votes' });
  } else if (!Number.isInteger(req.body.inc_votes)) {
    next({ status: 400, msg: 'inc_votes must be an integer' });
  } else
    updateArticle(req.params, req.body)
      .then(updatedArticle => {
        res.status(200).send({ updatedArticle: updatedArticle[0] });
      })
      .catch(next);
};

const getArticleComments = (req, res, next) => {
  selectArticleComments(req.params)
    .then(articleComments => {
      res.status(200).send({ articleComments });
    })
    .catch(next);
};

const postArticleComment = (req, res, next) => {
  insertArticleComment(req.params, req.body)
    .then(postedComment => {
      res.status(201).send({ postedComment: postedComment[0] });
    })
    .catch(next);
};

module.exports = {
  getArticles,
  getArticle,
  patchArticle,
  getArticleComments,
  postArticleComment
};
