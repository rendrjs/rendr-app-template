//
// Home of the main server object
//
var express = require('express'),
    _ = require('underscore'),
    env = require('./lib/env'),
    mw = require('./middleware'),
    DataAdapter = require('./lib/data_adapter'),
    rendrServer = require('rendr').server,
    rendrMw = require('rendr/server/middleware'),
    viewEngine = require('rendr/server/viewEngine'),
    walk = require('rendr/server/utils').walk,
    app;

app = express();

//
// Initialize our server
//
exports.init = function init(options, callback) {
  initMiddleware();
  initLibs(function(err, result) {
    if (err) return callback(err);
    buildRoutes(app);
    callback(null, result);
  });
};

//
// options
// - port
//
exports.start = function start(options) {
  options = options || {};
  var port = options.port || 3030;
  app.listen(port);
  console.log("server pid " + process.pid + " listening on port " + port + " in " + app.settings.env + " mode");
};

//
// Initialize middleware stack
//
function initMiddleware() {
  app.configure(function() {
    // set up views
    app.set('views', __dirname + '/../app/views');
    app.set('view engine', 'js');
    app.engine('js', viewEngine);

    // set the middleware stack
    app.use(express.compress());
    app.use(express.static(__dirname + '/../public'));
    app.use(express.logger());
    app.use(express.bodyParser());
    app.use(app.router);
    app.use(mw.errorHandler());
  });
}

//
// Initialize our libraries
//
function initLibs(callback) {
  var options;
  options = {
    dataAdapter: new DataAdapter(env.current.apiHosts),
    errorHandler: mw.errorHandler()
  };
  rendrServer.init(options, callback);
}

//
// Routes & middleware
//

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
  var apiHostsMap = buildApiHostsMap(),
      fnChain = preRendrMiddleware.concat(rendrMw.apiProxy(apiHostsMap));
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

function buildApiHostsMap( ) {
  var hostsMap = {},
      dirs = ['app/models', 'app/collections'];

  _.each(dirs, function(dir) {
    walk(dir, function(err, models) {
      if (err) throw err;
      // rip the `url` and `apiHost` props from each model/collection
      models.map(function(modelName) {
        var Model = require(process.env.PWD+"/" + modelName),
            model = new Model(),
            ob = _.pick(model, 'url', 'apiHost');
        if (typeof ob.apiHost != undefined && hostsMap[ob.apiHost] == undefined) { hostsMap[ob.apiHost] = []; }
        if (typeof ob.url === 'string') { hostsMap[ob.apiHost].push(ob.url); }
      });
    });
  });

  return hostsMap;
}
