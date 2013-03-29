# The client "rendrApp" is a way for the server to share data with the client views
module.exports = (config) ->
  (req, res, next) ->
    App = require('../../app/app')
    app = new App()

    # Stash on the request so can be accessed elsewhere
    req.rendrApp = app

    initAppProperties(app, config)
    next()

initAppProperties = (rendrApp, config) ->
  rendrApp.set config
