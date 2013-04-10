var utils = require('../lib/utils'),
    _ = require('underscore'),
    rendrServer = require('rendr/server/server');

// Middleware handler for intercepting API routes.
module.exports = function() {
  return function apiProxy(req, res, next) {
    var api, status;
    api = _.pick(req, 'path', 'query', 'method', 'body');
    rendrServer.dataAdapter.makeRequest(req, api, {convertErrorCode: false}, function(err, response, body) {
      if (err) return next(err);
      // Pass through statusCode, but not if it's an i.e. 304.
      status = response.statusCode;
      if (utils.isErrorStatus(status)) {
        res.status(status);
      }
      res.json(body);
    });
  };
};
