const express = require('express');
const apiRouter = require('./routes/apiRouter');
const { routeNotFound, handle500, handle404 } = require('./errors');

const app = express();

app.use(express.json());

app.use('/api', apiRouter);

app.use(handle404);

app.all('/*', routeNotFound);

app.use(handle500);

module.exports = app;
