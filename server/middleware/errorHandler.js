var express = require('express'),
    handle404 = require('./handle404');

//
// This is the error handler used with Rendr routes.
//
module.exports = function() {
  return function errorHandler(err, req, res, next) {
    if (err.status === 401) {
      res.redirect('/login');
    } else if (err.status === 404) {
      handle404()(req, res, next);
    } else {
      express.errorHandler()(err, req, res, next);
    }
  };
};
