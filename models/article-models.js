const connection = require('../db/connection.js');

const selectArticles = ({ sort_by, order, author, topic }) => {
  return connection
    .select(
      'articles.author', // username from users table
      'articles.title',
      'articles.article_id',
      'articles.topic',
      'articles.created_at',
      'articles.votes'
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

module.exports = { selectArticles };
