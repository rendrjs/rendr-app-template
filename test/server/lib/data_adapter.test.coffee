dataAdapter = require(__dirname + '/../../../../server/lib/data_adapter')
should = require('should')
sinon = require('sinon')
_ = require('underscore')
airApi = require('airbnb-api')
memcache = require(__dirname + '/../../../../server/lib/memcache')
utils = require(__dirname + '/../../../../server/lib/utils')
env = require(__dirname + '/../../../../config/environments/env')

stubs = []
stubbedReq =
  rendrApp:
    sessionManager:
      get: (key) ->
        "#{key}_value"
    origRequest: ->
      headers:
        'x-forwarded-for':'foo'

describe 'data adapter basics', ->

  beforeEach ->
    stubs.push(sinon.stub(utils, "isErrorStatus", (status, options) ->
      return true
    ))

  afterEach  ->
    stubs.forEach (s) ->
      s.restore()

  it 'should retrieve session values', () ->
    vals = dataAdapter._sessionVals(stubbedReq, ['one','two','three'])
    expected = {"one":"one_value","two":"two_value","three":"three_value"}
    should.deepEqual(vals, expected)

  it 'should retrieve header values', () ->
    vals = dataAdapter._headerVals(stubbedReq, ['x-forwarded-for'])
    expected = {"x-forwarded-for":"foo"}
    should.deepEqual(vals, expected)

  it 'should set correct api default values for string', () ->
    api = dataAdapter._apiDefaults('/this/is/a/string')
    expected = {"path":"/this/is/a/string","query":{},"headers":{}}
    should.deepEqual(api, expected)

  it 'should set correct api default values for get request', () ->
    req = _.clone(stubbedReq)
    _.extend(req, {method:'get',path:'/this/is/req/path', query:{id:123}})
    api = dataAdapter._apiDefaults(req)
    expected =
      method:"get",
      path:"/this/is/req/path",
      query:
        id:123,
        locale:"locale_value",
        currency:"currency_value",
        oauth_token:"access_token_value"
      headers:
        'x-forwarded-for': 'foo'
      json: undefined

    should.deepEqual(api, expected)


  it 'should set correct api default values for post request', () ->
    req = _.clone(stubbedReq)
    _.extend(req, {method:'post',path:'/this/is/req/path', body:{foo:'bar'}})
    api = dataAdapter._apiDefaults(req)
    expected =
      method:"post",
      path:"/this/is/req/path",
      query:
        locale:"locale_value",
        currency:"currency_value",
        oauth_token:"access_token_value"
      headers:
        'x-forwarded-for': 'foo'
      json: {foo:'bar'}

    should.deepEqual(api, expected)

  it 'should correctly handle GET with empty body', () ->
    req = _.clone(stubbedReq)
    _.extend(req, {method:'get',path:'/this/is/req/path', body:{}})
    api = dataAdapter._apiDefaults(req)
    expected =
      method: 'get'
      path: '/this/is/req/path'
      query:
        locale: 'locale_value',
        currency: 'currency_value',
        oauth_token: 'access_token_value'
      headers:
        'x-forwarded-for': 'foo'
    should.deepEqual(api, expected)

  it 'should correctly handle error response', () ->
    res = {statusCode:400, body:'oops. an error occurred'}
    err = dataAdapter._getErrForResponse(res)
    err.status.should.equal(res.statusCode)
    err.body.should.equal(res.body)

describe 'data adapter request', ->

  stubbedResponse = {statusCode:200, body:"stubbed response body"}
  beforeEach ->
    stubs.push(sinon.stub(airApi, "makeRequest", (requestApi, cb) ->
      return cb(null, stubbedResponse, stubbedResponse.body, 11)
    ))

  afterEach  ->
    stubs.forEach (s) ->
      s.restore()

  it 'should make request with options', () ->
    stubbedRequest = {path:'/one/two/three'}
    dataAdapter.makeRequest stubbedRequest, {}, (err, response, body) ->
      if (err)
        throw err
      should.deepEqual(response, stubbedResponse)
      body.should.equal(response.body)

  it 'should make request without options', () ->
    stubbedRequest = {path:'/one/two/three'}
    dataAdapter.makeRequest stubbedRequest, (err, response, body) ->
      if (err)
        throw err
      should.deepEqual(response, stubbedResponse)
      body.should.equal(response.body)
