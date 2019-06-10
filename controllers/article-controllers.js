const {
  selectArticles,
  selectArticle,
  updateArticle,
  selectArticleComments,
  insertArticleComment,
  countArticles,
  countArticleComments
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
      return Promise.all([countArticles(req.query), selectArticles(req.query)]);
    })
    .then(([{ count }, articles]) => {
      count = +count;
      res.status(200).send({ articles, total_count: count });
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
  if (Object.keys(req.body).length === 0) {
    req.body.inc_votes = 0;
  }
  if (!Object.keys(req.body).includes('inc_votes')) {
    next({ status: 400, msg: 'request must include inc_votes' });
  } else if (Object.keys(req.body).length > 1) {
    next({ status: 400, msg: 'request must only include inc_votes' });
  } else if (!Number.isInteger(req.body.inc_votes)) {
    next({ status: 400, msg: 'inc_votes must be an integer' });
  } else
    updateArticle(req.params, req.body)
      .then(updatedArticle => {
        if (updatedArticle.length < 1)
          return Promise.reject({ status: 404, msg: 'article not found' });
        res.status(200).send({ article: updatedArticle[0] });
      })
      .catch(next);
};

const getArticleComments = (req, res, next) => {
  Promise.all([
    selectArticleComments(req.params, req.query),
    countArticleComments(req.params)
  ])
    .then(([articleComments, { count }]) => {
      count = +count;
      if (count > 0)
        res.status(200).send({ comments: articleComments, total_count: count });
      else
        return Promise.all([selectArticle(req.params), articleComments, count]);
    })
    .then(([article, articleComments, count]) => {
      if (!article)
        return Promise.reject({ status: 404, msg: 'article not found' });
      else
        res.status(200).send({ comments: articleComments, total_count: count });
    })
    .catch(next);
};

const postArticleComment = (req, res, next) => {
  if (
    !Object.keys(req.body).includes('username') ||
    !Object.keys(req.body).includes('body')
  ) {
    next({ status: 400, msg: 'comment must contain a username and body' });
  } else if (Object.keys(req.body).length > 2) {
    next({ status: 400, msg: 'request must only include a username and body' });
  } else if (
    typeof req.body.username !== 'string' ||
    typeof req.body.body !== 'string'
  ) {
    next({ status: 400, msg: 'comment and username must be text' });
  } else
    insertArticleComment(req.params, req.body)
      .then(postedComment => {
        res.status(201).send({ comment: postedComment[0] });
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
