utils = require('../lib/utils')
dataAdapter = require('../lib/data_adapter')

# middleware handler for intercepting api routes
module.exports = ->
 (req, res, next) ->
    dataAdapter.makeRequest req, {convertErrorCode: false}, (err, response, body) ->
      return next(err) if err
      # Pass through statusCode, but not if it's an i.e. 304.
      status = response.statusCode
      if utils.isErrorStatus(status)
        res.status(status)
      res.json(body)
