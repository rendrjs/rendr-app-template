/*jshint strict:false */

// So we can `require()` Rendr files; need to convert Rendr to JS!
require('coffee-script');

var server = require('./server/server');

var port = process.env.PORT || 3030;

server.init({}, function(err) {
  if (err) throw err;
  server.start({port: port});
});
