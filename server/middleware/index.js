var fs = require('fs'),
    path = require('path');

fs.readdirSync(__dirname).forEach(function(filename) {
  var name;
  name = path.basename(filename, '.js');
  if (name === 'index' || name[0] === '_') return;
  exports.__defineGetter__(name, function() {
    return require('./' + name);
  });
});
