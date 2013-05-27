var utils = require('rendr/server/utils'),
    _ = require('underscore'),
    url = require('url'),
    request = require('request'),
    debug = require('debug')('app:DataAdapter'),
    inspect = require('util').inspect;

module.exports = DataAdapter;

function DataAdapter(options) {
  this.options = options || {};
}

//
// `req`: Actual request object from Express/Connect.
// `api`: Object describing API call; properties including 'path', 'query', etc.
//        Passed to `url.format()`.
// `options`: (optional) Options.
// `callback`: Callback.
//
DataAdapter.prototype.request = function(req, api, options, callback) {
  var _this = this, start, end;

  if (arguments.length === 3) {
    callback = options;
    options = {};
  }

  options = _.clone(options);
  _.defaults(options, {
    convertErrorCode: true,
    allow4xx: false
  });

  api = this.apiDefaults(api);
  start = new Date().getTime();
  request(api, function(err, response, body) {
    if (err) return callback(err);
    end = new Date().getTime();

    debug('%s %s %s %sms', api.method.toUpperCase(), api.url, response.statusCode, end - start);
    debug('%s', inspect(response.headers));

    if (options.convertErrorCode) {
      err = _this.getErrForResponse(response, {allow4xx: options.allow4xx});
    }
    if (typeof body === 'string' && ~(response.headers['content-type'] || '').indexOf('application/json')) {
      try {
        body = JSON.parse(body);
      } catch (e) {
        err = e;
      }
    }
    callback(err, response, body);
  });
};

DataAdapter.prototype.apiDefaults = function(api) {
  var urlOpts, basicAuth, authParts, apiHost;

  // Can specify a particular API to use, falling back to default.
  apiHost = this.options[api.api] || this.options['default'] || this.options || {};

  urlOpts = _.defaults(_.pick(api, 'protocol', 'port', 'query'), _.pick(apiHost, ['protocol', 'port', 'host']));
  urlOpts.pathname = api.path || api.pathname;

  api = _.defaults(api, {
    method: 'GET',
    url: url.format(urlOpts),
    headers: {}
  });

  // Add a custom UserAgent so GitHub API doesn't 403 us.
  if (api.headers['User-Agent'] == null) {
    api.headers['User-Agent'] = 'Rendr Api Proxy; Node.js';
  }

  if (api.body != null) {
    api.json = api.body;
  }

  basicAuth = process.env.BASIC_AUTH;
  if (basicAuth != null) {
    authParts = basicAuth.split(':');
    api.auth = {
      username: authParts[0],
      password: authParts[1],
      sendImmediately: true
    };
  }

  return api;
};

// Convert 4xx, 5xx responses to be errors.
DataAdapter.prototype.getErrForResponse = function(res, options) {
  var status, err;
  status = +res.statusCode;
  err = null;
  if (utils.isErrorStatus(status, options)) {
    err = new Error(status + " status");
    err.status = status;
    err.body = res.body;
  }
  return err;
};
