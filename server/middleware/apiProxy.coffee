utils = require('../lib/utils')
rendrServer = require('rendr').server

# middleware handler for intercepting api routes
module.exports = ->
 (req, res, next) ->
    api = _.pick(req, 'path', 'query', 'method')
    rendrServer.dataAdapter.makeRequest api, {convertErrorCode: false}, (err, response, body) ->
      return next(err) if err
      # Pass through statusCode, but not if it's an i.e. 304.
      status = response.statusCode
      if utils.isErrorStatus(status)
        res.status(status)
      res.json(body)
