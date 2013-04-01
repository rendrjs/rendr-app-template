rendrServer = require('rendr').server
env = require('./lib/env')
mw = require('./middleware')
rendrMw = require('rendr/server/middleware')

# insert these methods before rendr method chain for each route
_preRendrMiddleware = null
getPreRendrMiddleware =  ->
  _preRendrMiddleware ?= [
    # Initialize Rendr app, and pass in any config as
    # app attributes.
    rendrMw.initApp(env.current.rendrApp)
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
  buildRendrRoutes(app)
  app.get(/^(?!\/api\/)/, mw.handle404())

