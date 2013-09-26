var express = require('express'),
    rendr = require('rendr'),
    config = require('config'),
    mw = require('./server/middleware'),
    DataAdapter = require('./server/lib/data_adapter'),
    app;

app = express();

/**
 * Initialize Express middleware stack.
 */
function initMiddleware(rendrServer) {
  app.use(express.compress());
  app.use(express.static(__dirname + '/public'));
  app.use(express.logger());
  app.use(express.bodyParser());

  /**
   * To mount Rendr, which owns its own Express instance for better encapsulation,
   * simply add `rendrServer` as a middleware onto your Express app.
   * This will add all of the routes defined in your `app/routes.js`.
   * If you want to mount your Rendr app onto a path, you can do something like:
   *
   *     app.use('/my_cool_app', rendrServer);
   */
  app.use(rendrServer);

  /**
   * If you want to add custom middleware to Rendr's Express app, use `rendrServer.configure()`.
   * The only argument will be Rendr's internal Express instance, to which you can add middleware
   * or otherwise modify. You might want to do this to add middleware that needs to access
   * `req.rendrApp`, for example for fetching some data that you want to be available both
   * on the client & the server.
   *
   * It would look something like this:
   *
   *     rendrServer.configure(function(rendrExpressApp) {
   *       rendrExpressApp.use(function(req, res, next) {
   *         someLibrary.fetchSomethingAsynchronously(function(err, result) {
   *           if (err) return next(err);
   *           req.rendrApp.set('someProperty', result);
   *           next();
   *         });
   *       });
   *     });
   *
   * Then, in a model or view, you could access 'someProperty' from the `app`:
   *
   *     // app/views/some_view.js
   *     module.exports = BaseView.extend({
   *       ...
   *
   *       // Let's extend the `getTemplateData` method to pass some value to our template
   *       // that is dependent upon the `app`.
   *       getTemplateData: function() {
   *         var data = BaseView.prototype.getTemplateData.call(this);
   *         data.someProperty = this.app.get('someProperty');
   *         return data;
   *       }
   *     });
   */

  /**
   * Error handler goes last.
   */
  app.use(express.errorHandler());
}

/**
 * Initialize our Rendr server.
 *
 * We can pass inject various modules and options here to override
 * default behavior, i.e.:
 * - dataAdapter
 * - errorHandler
 * - appData
 */
function initServer() {
  var options = {
    dataAdapter: new DataAdapter(config.api),
    appData: config.rendrApp
  };
  return rendr.createServer(options);
}

/**
 * Start the Express server.
 */
function start() {
  var port = process.env.PORT || config.app.port;
  app.listen(port);
  console.log("server pid %s listening on port %s in %s mode",
    process.pid,
    port,
    app.settings.env);
}

/**
 * Here we actually initialize everything and start the Express server.
 */
var server = initServer();
initMiddleware(server);

/**
 * Only start server if this script is executed, not if it's require()'d.
 * This makes it easier to run integration tests on ephemeral ports.
 */
if (require.main === module) {
  start();
}

exports.app = app;
