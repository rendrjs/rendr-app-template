var Base = require('./base');

module.exports = Base.extend({
  url: '/users/:login'
});
module.exports.identifier = 'User';
