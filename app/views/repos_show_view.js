var BaseView = require('./base_view');

module.exports = BaseView.extend({
  className: 'repos_show_view',

  getTemplateData: function() {
    var data = BaseView.prototype.getTemplateData.call(this);
    data.build = this.options.build.toJSON();
    return data;
  }
});
module.exports.id = 'ReposShowView';
