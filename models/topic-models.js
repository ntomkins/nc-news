const connection = require('../db/connection.js');

const selectTopics = () => {
  return connection.select().from('topics');
};

module.exports = { selectTopics };
