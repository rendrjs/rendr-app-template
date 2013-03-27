express = require('express')
env = require('../../config/environments/env')
handle404 = require('./handle404')

##
# This is the error handler used with Rendr routes.
##
module.exports = ->
  options = env.current.errorHandler || {}

  handler = if options.dumpExceptions
      express.errorHandler(options)
    else
      (err, req, res, next) ->
        res.status(500)
        res.render('error_view', app: req.rendrApp, req: req)

  (err, req, res, next) ->
    if err.status is 401
      res.redirect('/login')
      return

    if err.status is 404 && !options.dumpExceptions
      handle404()(req, res, next)
      return

    handler(err, req, res, next)
