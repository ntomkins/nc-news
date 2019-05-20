const { articleData, commentData, topicData, userData } = require('../data');
const {
  timeToDate,
  createRef,
  refArray,
  renameKey
} = require('../../utils/seed-utils.js');

exports.seed = (knex, Promise) => {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return knex('topics')
        .insert(topicData)
        .returning('*');
    })
    .then(topicRows => {
      return knex('users')
        .insert(userData)
        .returning('*');
    })
    .then(userRows => {
      const articleDataDate = timeToDate(articleData);
      return knex('articles')
        .insert(articleDataDate)
        .returning('*');
    })
    .then(articleRows => {
      const commentDataAuthor = renameKey(commentData, 'created_by', 'author');
      const commentDataDate = timeToDate(commentDataAuthor);
      const articleIdRef = createRef(articleRows, 'title', 'article_id');
      const commentDataDateId = refArray(
        commentDataDate,
        articleIdRef,
        'belongs_to',
        'article_id'
      );
      return knex('comments')
        .insert(commentDataDateId)
        .returning('*');
    })
    .then(commentRows => {});
};
