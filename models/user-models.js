const connection = require('../db/connection.js');

const selectUser = ({ user_id }) => {
  return connection
    .select(username, avatar_url, name)
    .from('users')
    .where({ user_id });
};

module.exports = {
  selectUser
};
