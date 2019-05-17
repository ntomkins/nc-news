exports.routeNotFound = (req, res) => {
  res.status(404).send({ msg: 'Route Not Found' });
};

exports.methodNotAllowed = (req, res) => {
  res.status(405).send({ msg: 'Method Not Allowed' });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handleSQLErrors = (err, req, res, next) => {
  const codes = {
    '22P02': 'invalid input syntax for type integer',
    '42703': 'querry input does not exist',
    '23503': 'article not found'
  };
  if (codes[err.code]) {
    if (err.code === '23503') {
      res.status(404).send({ msg: codes[err.code] });
    } else {
      res.status(400).send({ msg: codes[err.code] });
    }
  }
  next(err);
};

exports.handle500 = (err, req, res, next) => {
  res.status(500).send({ msg: 'Internal Server Error' });
};
