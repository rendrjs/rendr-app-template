/*jshint strict:false */

var server = require('./server/server');

var port = process.env.PORT || 3030;

server.init({}, function(err) {
  if (err) throw err;
  server.start({port: port});
});
