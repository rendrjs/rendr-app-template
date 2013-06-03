//
// Home of the main server object
//
var express = require('express'),
    env = require('./lib/env'),
    mw = require('./middleware'),
    DataAdapter = require('./lib/data_adapter'),
    rendrServer = require('rendr').server,
    rendrMw = require('rendr/server/middleware'),
    viewEngine = require('rendr/server/viewEngine'),
    RedisStore = require('connect-redis')(express),
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
// Storage for sessions
//
var storage = new RedisStore({prefix:'rendr'});

storage.once('connect', function() {
  console.log('REDIS connected :-)');
});

storage.once('disconnect', function() {
  console.error('REDIS not available... sessions will not work :-(');
});

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

    app.use(express.cookieParser());
    app.use(express.session({
      store: storage,
      secret: env.current.sessionSecret,
      cookie: { maxAge: 1000*60*60*24*7 } // one week
    }));

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
    dataAdapter: new DataAdapter(env.current.api),
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
  rendrMw.initApp(env.current.rendrApp),


  // access to sessions, and record session creation date
  function(req, res, next) {
    if(req.session) {
      req.session.created = req.session.created || Date.now();
      req.rendrApp.set('session', req.session);
    }
    next();
  }
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
