var BaseView = require('../base')
  , ReposList = require('../../components/repos_list')
  , React;

if (!this.window) {
  React = require('../../lib/modules/React');
} else {
  React = window.React
}

module.exports = BaseView.extend({
  postRender: function() {
    React.renderComponent(this.getComponent(), this.el);
  },

  getComponent: function() {
    return ReposList(this.getInitialProps());
  },

  getInitialProps: function() {
    return {
      repos: this.collection.toJSON()
    };
  },

  getInnerHtml: function() {
    var html;

    React.renderComponentToString(this.getComponent(), function(reactHtml) {
      html = reactHtml;
    });

    return html;
  }
});
module.exports.id = 'repos/index';
