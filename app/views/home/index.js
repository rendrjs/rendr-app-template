var BaseView = require('../base')
  , ExampleApplication = require('../../components/example_application')
  , React;

if (!this.window) {
  React = require('../../lib/modules/React');
} else {
  React = window.React
}

module.exports = BaseView.extend({
  className: 'home_index_view',

  postInitialize: function() {
    console.log(React);
  },

  postRender: function() {
    React.renderComponent(this.getComponent(), this.el);

    var start = new Date().getTime();
    setInterval(function() {
      React.renderComponent(ExampleApplication({
        message: 'hello world',
        elapsed: Date.now() - start
      }), this.el);
    }.bind(this), 50);
  },

  getComponent: function() {
    return ExampleApplication({
      message: 'hello world',
      elapsed: 0
    });
  },

  getInnerHtml: function() {
    var html;

    React.renderComponentToString(this.getComponent(), function(reactHtml) {
      html = reactHtml;
    });

    return html;
  }
});
module.exports.id = 'home/index';
