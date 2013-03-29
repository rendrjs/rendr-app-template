var BaseApp = require('rendr/shared/app');

module.exports = BaseApp.extend({
  defaults: {
    loading: false
  },

  // @shared
  postInitialize: function() {
    this.initHandlebarsHelpers();
  },

  initHandlebarsHelpers: function() {
    var handlebarsHelpers = require('./helpers/handlebars_helpers');
    _.each(handlebarsHelpers, function(value, key) {
      Handlebars.registerHelper(key, value);
    });
  },

  // @client
  start: function() {
    // Show a loading indicator when the app is fetching.
    this.router.on('action:start', function() { this.set({loading: true});  }, this);
    this.router.on('action:end',   function() { this.set({loading: false}); }, this);

    BaseApp.prototype.start.call(this);
  }

});
