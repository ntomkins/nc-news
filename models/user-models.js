const connection = require('../db/connection.js');

const selectUser = ({ username }) => {
  return connection
    .select('username', 'avatar_url', 'name')
    .from('users')
    .where({ username })
    .first();
};

module.exports = {
  selectUser
};
