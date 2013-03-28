# The client "rendrApp" is a way for the server to share data with the client views
# pathToClientApp = MOWEB_ROOT/app/app
module.exports = (pathToClientApp, config) ->
  (req, res, next) ->
    App = require(pathToClientApp)
    remoteAddress = null
    if req.connection
      remoteAddress = req.connection.remoteAddress
    app = new App()

    # Stash on the request so can be accessed elsewhere
    req.rendrApp = app

    initAppProperties(app, config)
    next()

initAppProperties = (rendrApp, config) ->
  rendrApp.set config
