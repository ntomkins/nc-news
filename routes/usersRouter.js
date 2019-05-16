const usersRouter = require('express').Router();

const { getUser } = require('../controllers/user-controllers.js');

usersRouter.route('/:username').get(getUser);

module.exports = usersRouter;
