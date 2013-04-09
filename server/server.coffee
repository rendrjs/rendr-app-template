#
# Home of the main server object
#
require('coffee-script')
_ = require('underscore')
rendrServer = require('rendr').server
express = require('express')
env = require('./lib/env');
mw = require('./middleware')
rendrMw = require('rendr/server/middleware')
DataAdapter = require('./lib/data_adapter')
viewEngine = require('rendr/server/viewEngine')

# Module variables
app = express()

#
# Initialize our server
#
exports.init = (options, callback) ->
  initMiddleware()
  initLibs (err, result) ->
    return callback(err) if err
    buildRoutes(app)
    callback(null, result)

#
# options
# - port
#
exports.start = (options = {}) ->
  port = options.port || 3030
  app.listen(port)
  console.log("server pid #{process.pid} listening on port #{port} in #{app.settings.env} mode")

#
# Initialize middleware stack
#
initMiddleware = ->
  app.configure ->
    # set up views
    app.set('views', __dirname + '/../app/views')
    app.set('view engine', 'js')
    app.engine('js', viewEngine)

    # set the middleware stack
    app.use(express.compress())
    app.use(express.static(__dirname + '/../public'))
    app.use(express.logger())
    app.use(express.bodyParser())
    app.use(app.router)
    app.use(mw.errorHandler())

#
# Initialize our libraries
#
initLibs = (callback) ->
  dataAdapter = new DataAdapter(env.current.api)

  options =
    dataAdapter: dataAdapter
    errorHandler: mw.errorHandler()
  rendrServer.init(options, callback)

#
# Routes & middleware
#

# Attach our routes to our server
buildRoutes = (app) ->
  buildApiRoutes(app)
  buildRendrRoutes(app)
  app.get(/^(?!\/api\/)/, mw.handle404())

# Insert these methods before Rendr method chain for all routes, plus API.
preRendrMiddleware = [
  # Initialize Rendr app, and pass in any config as app attributes.
  rendrMw.initApp(env.current.rendrApp)
]

buildApiRoutes = (app) ->
  fnChain = preRendrMiddleware.concat(mw.apiProxy())
  app.use('/api', fn) for fn in fnChain

buildRendrRoutes = (app) ->
  # attach rendrServer routes
  routes = rendrServer.router.buildRoutes()
  routes.forEach (args) ->
    path = args.shift()
    definition = args.shift()
    fnChain = preRendrMiddleware

    # Additional arguments are more handlers.
    fnChain = fnChain.concat(args)

    # Have to add error handler AFTER all other handlers.
    fnChain.push(mw.errorHandler())

    # Attach the route to the Express server.
    app.get(path, fnChain)

