const commentsRouter = require('express').Router();
const { methodNotAllowed } = require('../errors');
const {
  patchComment,
  deleteComment
} = require('../controllers/comment-controllers.js');

commentsRouter
  .route('/:comment_id')
  .patch(patchComment)
  .delete(deleteComment)
  .all(methodNotAllowed);

module.exports = commentsRouter;
