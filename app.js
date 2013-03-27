/*jshint strict:false */

require('coffee-script');
var server = require('./server/server');
var env = require('./config/environments/env');
var assets = require('./server/lib/assets');

var port = process.env.PORT || 3030;

var preCompile = function(cb) { return cb(); }; // empty function wrapper
if (env.name === 'development') {
  preCompile = assets.compile;
}

preCompile(function(err) {
  if (err) throw err;
  server.init({}, function(err) {
    if (err) throw err;
    server.start({port: port});
  });
});

