utils = require('./utils')
_ = require('underscore')
url = require('url')
request = require('request')
debug = require('debug')('app:DataAdapter')
inspect = require('util').inspect

module.exports = class DataAdapter

  options: null

  constructor: (options) ->
    @options = options || {}

  makeRequest: (req, options, callback) ->
    if arguments.length is 2
      callback = options
      options = {}

    options = _.clone(options)
    _.defaults options,
      convertErrorCode: true
      # TODO: default to true?
      allow4xx: false

    requestApi = @apiDefaults(req)
    start = new Date().getTime()
    request requestApi, (err, response, body) =>
      return callback(err) if err?
      end = new Date().getTime()
      debug('%s %s %s %sms', requestApi.method.toUpperCase(), requestApi.url, response.statusCode, end - start)
      debug('%s', inspect(response.headers))
      if options.convertErrorCode
        err = @getErrForResponse(response, {allow4xx: options.allow4xx})
      if ~(response.headers['content-type'] || '').indexOf('application/json')
        try
          body = JSON.parse(body)
        catch e
          err = e
      callback(err, response, body)

  apiDefaults: (req) ->
    api = _.pick(req, 'method')

    optionsKeys = ['protocol', 'port', 'host']

    urlOpts = _.defaults _.pick(req, 'protocol', 'port', 'query'), _.pick(@options, optionsKeys)
    urlOpts.pathname = req.path || req.pathname || req.url?.split('?')[0]

    api = _.defaults api,
      method: 'GET'
      url: url.format(urlOpts)

    api.json = req.body if req.body?

    basicAuth = process.env.BASIC_AUTH
    if basicAuth?
      authParts = basicAuth.split(':')
      api.auth =
        username: authParts[0]
        password: authParts[1]
        sendImmediately: true

    api

  # Convert 4xx, 5xx responses to be errors.
  getErrForResponse: (res, options = {}) ->
    status = +res.statusCode
    err = null
    if utils.isErrorStatus(status, options)
      err = new Error("#{status} status")
      err.status = status
      err.body = res.body
    err
