/*jshint strict:false */

require('coffee-script');
var server = require('./server/server');
var spawn = require('child_process').spawn;

var port = process.env.PORT || 3030;

var compileAssets = function(callback) {
  var grunt = spawn('grunt');
  grunt.stdout.on('data', function(data) {
    console.log('' + data);
  });

  grunt.stderr.on('data', function(data) {
    console.log('grunt stderr: ' + data);
  });

  grunt.on('exit', function(code) {
    var err;
    if (code !== 0) {
      err = new Error('grunt exited with code:' + code);
    }
    callback(err);
  });
};

compileAssets(function(err) {
  if (err) throw err;
  server.init({}, function(err) {
    if (err) throw err;
    server.start({port: port});
  });
});

