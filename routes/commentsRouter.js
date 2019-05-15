const commentsRouter = require('express').Router();
const { patchComment } = require('../controllers/comment-controllers.js');

commentsRouter.route('/:comment_id').patch(patchComment);

module.exports = commentsRouter;
