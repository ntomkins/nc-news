const connection = require('../db/connection.js');

const updateComment = ({ comment_id }, { inc_votes }) => {
  return connection
    .increment('votes', inc_votes)
    .from('comments')
    .where({ comment_id })
    .returning('*');
};

const delComment = ({ comment_id }) => {
  return connection('comments')
    .where({ comment_id })
    .del()
    .from('comments');
};

module.exports = {
  updateComment,
  delComment
};
