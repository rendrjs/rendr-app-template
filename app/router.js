var BaseClientRouter = require('rendr/client/router');

var Router = module.exports = function Router(options) {
  BaseClientRouter.call(this, options);
};

/**
 * Cross-platform inheritance, taking advantage of `es5shim` for IE.
 */
Router.prototype = Object.create(BaseClientRouter.prototype);
Router.prototype.constructor = BaseClientRouter;

Router.prototype.postInitialize = function() {
  this.on('action:start', this.trackImpression, this);
};

Router.prototype.trackImpression = function() {
  if (window._gaq) {
    _gaq.push(['_trackPageview']);
  }
};
