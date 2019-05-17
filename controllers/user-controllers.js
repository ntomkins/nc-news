const { selectUser } = require('../models/user-models.js');

const getUser = (req, res, next) => {
  selectUser(req.params)
    .then(user => {
      if (!user) return Promise.reject({ status: 404, msg: 'user not found' });
      else res.status(200).send({ user });
    })
    .catch(next);
};

module.exports = {
  getUser
};
