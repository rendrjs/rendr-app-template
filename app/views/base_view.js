var RendrView = require('rendr/shared/base/view');

// Create a base view, for adding common extensions to our
// application's views.
module.exports = RendrView.extend({

  getTemplateData: function() {
    var data = RendrView.prototype.getTemplateData.call(this);
    data._session = this.app.get('session') || false;
    return data;
  }

});
