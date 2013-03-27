airApi = require('airbnb-api')
utils = require('./utils')
_ = require('underscore')

# retrieve header values from original request stashed in app
exports._headerVals = headerVals = (req, keys) ->
  vals = {}
  app = req.rendrApp
  origRequest = app?.origRequest()
  headers = origRequest?.headers
  if keys && headers
    keys.forEach (k) ->
      value = origRequest.headers[k]
      if value
        vals[k] = value
      else if k == 'x-forwarded-for' && origRequest.remoteAddress
        vals[k] = origRequest.remoteAddress
  vals


# return hash defining api request including: method, path, query, json, headers
exports._apiDefaults = apiDefaults = (req) ->

  # Support both using it directly, and passing an express req in.
  if typeof req is "string"
    api =
      path: req
      query: {}
  else
    api =
      method: req.method
      path: req.path || req.url.split('?')[0]
      query: _.clone(req.query) || {}
      json: req.body

  # handle weird case where method="GET" and json={}.  (this originally signalled
  # that we wanted json response parsed, which now happens by default).  Remove
  # empty json body.
  if api.method && api.method.toLowerCase() == 'get' && api.json
    delete api.json

  api.headers = headerVals(req, ['x-forwarded-for'])

  api


# Convert 4xx, 5xx responses to be errors.
exports._getErrForResponse = getErrForResponse = (res, options = {}) ->
  status = +res.statusCode
  err = null
  if utils.isErrorStatus(status, options)
    err = new Error("#{status} status")
    err.status = status
    err.body = res.body
  err


exports.makeRequest = (req, options, callback) ->
  if arguments.length is 2
    callback = options
    options = {}

  options = _.clone(options)
  _.defaults options,
    convertErrorCode: true
    # TODO: default to true?
    allow4xx: false

  api = apiDefaults(req)
  requestApi = airApi.convertApi(api)
  airApi.makeRequest requestApi, (err, response, body, runtime) ->
    if options.convertErrorCode
      err ||= getErrForResponse(response, {allow4xx: options.allow4xx})
    callback(err, response, body);
