//
// Home of the main server object
//
var express = require('express'),
    env = require('./lib/env'),
    mw = require('./middleware'),
    DataAdapter = require('./lib/data_adapter'),
    rendr = require('rendr'),
    rendrMw = require('rendr/server/middleware'),
    app,
    server;

app = express();

/**
 * Initialize our server
 */
exports.init = function init(callback) {
  try {
    initMiddleware();
    initServer();
    callback(null);
  } catch (err) {
    callback(err);
  }
};

/**
 * Start the Express server.
 *
 * Options:
 * - port
 */
exports.start = function start(options) {
  options = options || {};
  var port = options.port || 3030;
  app.listen(port);
  console.log("server pid " + process.pid + " listening on port " + port + " in " + app.settings.env + " mode");
};

/**
 * Initialize our Rendr server.
 *
 * We can pass inject various modules here to override default behavior:
 * - dataAdapter
 * - errorHandler
 */
function initServer() {
  var options = {
    dataAdapter: new DataAdapter(env.current.api),
    errorHandler: mw.errorHandler(),
    appData: env.current.rendrApp
  };
  server = rendr.createServer(app, options);
}

/**
 * Initialize middleware stack
 */
function initMiddleware() {
  app.configure(function() {
    // set the middleware stack
    app.use(express.compress());
    app.use(express.static(__dirname + '/../public'));
    app.use(express.logger());
    app.use(express.bodyParser());
    app.use(app.router);
    app.use(mw.errorHandler());
  });
}
