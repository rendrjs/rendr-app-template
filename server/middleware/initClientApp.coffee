# The client "rendrApp" is a way for the server to share data with the client views
# pathToClientApp = MOWEB_ROOT/app/app
module.exports = (pathToClientApp, config) ->
  (req, res, next) ->
    App = require(pathToClientApp)
    remoteAddress = null
    if req.connection
      remoteAddress = req.connection.remoteAddress
    app = new App
      session_manager: req.session?.data
      req:
        headers: req.headers
        requestId: req.requestId
        remoteAddress: remoteAddress

    # Stash on the request so can be accessed elsewhere
    req.rendrApp = app

    initSessionManager(app, req)
    initAppProperties(app, config)
    next()

initSessionManager = (rendrApp, req) ->
  sm = rendrApp.sessionManager
  session = req.session.data
  # When values in the sessionManager change, reflect
  # change in session.
  sm.on 'change', (model, meta) ->
    changedAttributes = Object.keys(meta.changes)
    newAttrs = {}
    for key in changedAttributes
      newAttrs[key] = sm.get(key)
    _.extend(session, newAttrs)

initAppProperties = (rendrApp, config) ->
  rendrApp.set config
