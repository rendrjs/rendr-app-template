var BaseView = require('./base_view');

module.exports = BaseView.extend({
  getTemplateData: function() {
    var data = BaseView.prototype.getTemplateData.call(this);
    data.repos = this.options.repos.toJSON();
    return data;
  }
});
module.exports.identifier = 'UsersShowView';
