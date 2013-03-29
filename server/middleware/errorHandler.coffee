express = require('express')
handle404 = require('./handle404')

##
# This is the error handler used with Rendr routes.
##
module.exports = ->
  handler = express.errorHandler()

  (err, req, res, next) ->
    if err.status is 401
      res.redirect('/login')
      return

    if err.status is 404
      handle404()(req, res, next)
      return

    handler(err, req, res, next)
