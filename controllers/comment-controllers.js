const { updateComment, delComment } = require('../models/comment-models.js');

const patchComment = (req, res, next) => {
  updateComment(req.params, req.body).then(updatedComment => {
    res.status(200).send({ updatedComment: updatedComment[0] });
  });
};

const deleteComment = (req, res, next) => {
  delComment(req.params).then(deletedComment => {
    res.sendStatus(204);
  });
};

module.exports = {
  patchComment,
  deleteComment
};
