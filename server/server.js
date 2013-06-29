//
// Home of the main server object
//
var express = require('express'),
    env = require('./lib/env'),
    mw = require('./middleware'),
    DataAdapter = require('./lib/data_adapter'),
    rendrServer = require('rendr').server,
    rendrMw = require('rendr/server/middleware'),
    app;

app = express();

/**
 * Initialize our server
 */
exports.init = function init(callback) {
  initServer(function(err, result) {
    if (err) return callback(err);
    initMiddleware();
    buildRoutes(app);
    callback(null, result);
  });
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
function initServer(callback) {
  var options = {
    dataAdapter: new DataAdapter(env.current.api),
    errorHandler: mw.errorHandler()
  };
  rendrServer.init(options, callback);
}

/**
 * Initialize middleware stack
 */
function initMiddleware() {
  app.configure(function() {
    // set up views
    app.set('views', __dirname + '/../app/views');
    app.set('view engine', 'js');
    app.engine('js', rendrServer.viewEngine.render);

    // set the middleware stack
    app.use(express.compress());
    app.use(express.static(__dirname + '/../public'));
    app.use(express.logger());
    app.use(express.bodyParser());
    app.use(app.router);
    app.use(mw.errorHandler());
  });
}

/**
 * Routes & middleware
 */

// Attach our routes to our server
function buildRoutes(app) {
  buildApiRoutes(app);
  buildRendrRoutes(app);
  app.get(/^(?!\/api\/)/, mw.handle404());
}

// Insert these methods before Rendr method chain for all routes, plus API.
var preRendrMiddleware = [
  // Initialize Rendr app, and pass in any config as app attributes.
  rendrMw.initApp(env.current.rendrApp)
];

function buildApiRoutes(app) {
  var fnChain = preRendrMiddleware.concat(rendrMw.apiProxy());
  fnChain.forEach(function(fn) {
    app.use('/api', fn);
  });
}

function buildRendrRoutes(app) {
  var routes, path, definition, fnChain;
  // attach Rendr routes to our Express app.
  routes = rendrServer.router.buildRoutes();
  routes.forEach(function(args) {
    path = args.shift();
    definition = args.shift();

    // Additional arguments are more handlers.
    fnChain = preRendrMiddleware.concat(args);

    // Have to add error handler AFTER all other handlers.
    fnChain.push(mw.errorHandler());

    // Attach the route to the Express server.
    app.get(path, fnChain);
  });
}
