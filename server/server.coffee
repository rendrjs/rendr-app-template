#
# Home of the main server object
#
require('coffee-script')
rendrServer = require('rendr').server
express = require('express')
env = require('./lib/env');
router = require('./router')
mw = require('./middleware')
_ = require('underscore')
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
    if !err
      router.buildRoutes(app)
    callback(err, result)

#
# options
# - port
#
exports.start = (options, callback) ->
  options ||= {}
  port = options.port || 3030
  app.listen port, undefined, (err) ->
    console.log("server pid #{process.pid} listening on port #{port} in #{app.settings.env} mode")
    if callback
      callback(err, {port:port, env:app.settings.env})


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
