manifest = null

module.exports =
  asset_url: (path) ->
    if !manifest && global.isServer
      manifest = require(__dirname + '/../../public/manifest')
    manifest[path]
