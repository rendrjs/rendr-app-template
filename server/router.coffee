routes = require('./routes')
rendrServer = require('rendr').server
env = require('./lib/env')
mw = require('./middleware')

getController = (controllerName) ->
  require("./controllers/#{controllerName}_controller")

buildServerRoutes = (app) ->
  for own path, routeInfo of routes
    method = routeInfo.method || 'get'
    controller = getController(routeInfo.controller)

    # build action method-chain for route
    actions = []
    actions.push(controller[routeInfo.action])

    # connect route to our application
    app[method]("/#{path}", actions);

# insert these methods before rendr method chain for each route
_preRendrMiddleware = null
getPreRendrMiddleware =  ->
  _preRendrMiddleware ?= [
    mw.initSession()
    mw.initClientApp(env.current.clientApp)
  ]

buildRendrRoutes = (app) ->
  # attach rendrServer routes
  rendrRoutes = rendrServer.router.buildRoutes()
  rendrRoutes.forEach (args) ->
    path = args.shift()
    definition = args.shift()
    fnChain = getPreRendrMiddleware()

    # Additional arguments are more handlers.
    fnChain = fnChain.concat(args)

    # Have to add error handler AFTER all other handlers.
    fnChain.push(mw.errorHandler())

    app.get(path, fnChain)

buildApiRoutes = (app) ->
  fnChain = getPreRendrMiddleware().concat(mw.apiProxy())
  app.use('/api', fn) for fn in fnChain

# Attach our routes to our server
exports.buildRoutes = (app) ->
  buildApiRoutes(app)
  buildServerRoutes(app)
  buildRendrRoutes(app)
  app.get(/^(?!\/api\/)/, mw.handle404())

