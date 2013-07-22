var express = require('express'),
    notFoundHandler = require('rendr/server/middleware/notFoundHandler');

//
// This is the error handler used with Rendr routes.
//
module.exports = function() {
  return function errorHandler(err, req, res, next) {
    if (err.status === 401) {
      res.redirect('/login');
    } else if (err.status === 404) {
      notFoundHandler()(req, res, next);
    } else {
      express.errorHandler()(err, req, res, next);
    }
  };
};
