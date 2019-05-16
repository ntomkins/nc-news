const connection = require('../db/connection.js');

const selectUser = ({ username }) => {
  console.log(username);
  return connection
    .select('username', 'avatar_url', 'name')
    .from('users')
    .where({ username })
    .first();
};

module.exports = {
  selectUser
};
