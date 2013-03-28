var Repo = require('../models/repo')
  , Base = require('./base');

module.exports = Base.extend({
  url: '/repositories',
  model: Repo
});
module.exports.identifier = 'Repos';
