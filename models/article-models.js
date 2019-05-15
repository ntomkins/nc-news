const connection = require('../db/connection.js');

const selectArticles = ({ sort_by, order, author, topic }) => {
  return connection
    .select(
      'articles.article_id',
      'articles.title',
      'articles.author',
      'articles.topic',
      'articles.votes',
      'articles.created_at'
    )
    .count('comments.article_id as comment_count')
    .from('articles')
    .leftJoin('comments', 'comments.article_id', '=', 'articles.article_id')
    .groupBy('articles.article_id')
    .orderBy(sort_by || 'created_at', order || 'desc')
    .modify(query => {
      if (author) query.where('articles.author', '=', author);
      if (topic) query.where('articles.topic', '=', topic);
    });
};

const selectArticle = ({ article_id }) => {
  return connection
    .select(
      'articles.article_id',
      'articles.title',
      'articles.author',
      'articles.topic',
      'articles.body',
      'articles.votes',
      'articles.created_at'
    )
    .count('comments.article_id as comment_count')
    .from('articles')
    .leftJoin('comments', 'comments.article_id', '=', 'articles.article_id')
    .groupBy('articles.article_id')
    .where('articles.article_id', '=', article_id)
    .first();
};

const updateArticle = ({ article_id }, { inc_votes }) => {
  return connection
    .increment('votes', inc_votes)
    .from('articles')
    .where({ article_id })
    .returning('*');
};

const selectArticleComments = ({ article_id }) => {
  console.log(article_id);
  return connection
    .select(
      'comments.comment_id',
      'comments.votes',
      'comments.created_at',
      'comments.author',
      'comments.body',
      'comments.article_id'
    )
    .from('comments')
    .where('comments.article_id', '=', article_id);
};

module.exports = {
  selectArticles,
  selectArticle,
  updateArticle,
  selectArticleComments
};
