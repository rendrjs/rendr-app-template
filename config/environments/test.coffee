#
# Config settings for NODE_ENV=test
#
exports.rootDir = rootDir = __dirname + '/../..'
exports.publicDir = publicDir = rootDir + '/public'

exports.config =
  assetCompiler:
    enabled: false
    jsSrcPaths: [rootDir + '/app', rootDir + '/client']
    stichedJsFile: publicDir + '/mergedAssets.js'
    minify: true

  assets:
    publicDir: publicDir
    cdn:
      protocol: 'http'
      cnames: ['0.0.0.0:3030']
      pathPrefix: '/'
    fingerprint:
      enabled: false
      sourcePath: publicDir
      destinationPath: rootDir + '/static'

  errorHandler:
    dumpExceptions: true
    showStack: true
