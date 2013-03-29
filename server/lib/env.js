// Point to current environment/config values
var env = process.env.NODE_ENV || 'development';

exports.get = function(env) {
  return require('../../config/'+env).config;
};

exports.name = env;
exports.current = exports.get(env);
