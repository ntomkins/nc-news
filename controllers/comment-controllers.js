const { updateComment, delComment } = require('../models/comment-models.js');

const patchComment = (req, res, next) => {
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
    updateComment(req.params, req.body)
      .then(updatedComment => {
        if (updatedComment.length < 1)
          return Promise.reject({ status: 404, msg: 'comment not found' });
        else res.status(200).send({ updatedComment: updatedComment[0] });
      })
      .catch(next);
};

const deleteComment = (req, res, next) => {
  delComment(req.params)
    .then(deletedComment => {
      if (deletedComment < 1)
        return Promise.reject({ status: 404, msg: 'comment not found' });
      else res.sendStatus(204);
    })
    .catch(next);
};

module.exports = {
  patchComment,
  deleteComment
};
