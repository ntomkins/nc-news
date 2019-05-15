const usersRouter = require('express').Router();

const { getUser } = require('../controllers/user-controllers.js');

usersRouter.route('/:user_id').get(getUser);

module.exports = usersRouter;
