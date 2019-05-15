const { updateComment } = require('../models/comment-models.js');

const patchComment = (req, res, next) => {
  updateComment(req.params, req.body).then(updatedComment => {
    res.status(200).send({ updatedComment: updatedComment[0] });
  });
};

module.exports = {
  patchComment
};
