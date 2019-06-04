const express = require('express');
const apiRouter = require('./routes/apiRouter');
const {
  routeNotFound,
  handle500,
  handleCustomErrors,
  handleSQLErrors
} = require('./errors');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', apiRouter);

app.use(handleCustomErrors);

app.use(handleSQLErrors);

app.all('/*', routeNotFound);

app.use(handle500);

module.exports = app;
