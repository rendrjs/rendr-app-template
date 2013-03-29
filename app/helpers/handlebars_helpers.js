var manifest = null;

module.exports = {
  asset_url: function(path) {
    if (!manifest && global.isServer) {
      manifest = require(__dirname + '/../../public/manifest');
    }
    return manifest[path];
  }
};
