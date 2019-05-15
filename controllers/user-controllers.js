const { selectUser } = require('../models/user-models.js');

const getUser = (req, res, next) => {
  selectUser(req.params).then(user => {
    res.status(200).send({ user });
  });
};

module.exports = {
  getUser
};
