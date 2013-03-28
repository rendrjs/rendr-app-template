var Base = require('./base');

module.exports = Base.extend({
  url: '/repos/:owner/:name'
});
module.exports.identifier = 'Repo';
