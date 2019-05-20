const apiRouter = require('express').Router();
const { methodNotAllowed } = require('../errors');
const topicsRouter = require('./topicsRouter.js');
const articlesRouter = require('./articlesRouter.js');
const commentsRouter = require('./commentsRouter.js');
const usersRouter = require('./usersRouter.js');
const apiEndpoints = require('../endpoints.json');

apiRouter
  .route('/')
  .get((req, res) => res.send(apiEndpoints))
  .all(methodNotAllowed);

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;
