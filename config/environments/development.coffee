#
# Config settings for NODE_ENV=development
#

exports.config =
  assets:
    minify: false
    cdn:
      protocol: 'http'
      cnames: ['0.0.0.0:3030']
      # cnames: ['10.0.44.229:3030']
      pathPrefix: '/'
    fingerprint:
      enabled: false

  errorHandler:
    dumpExceptions: true
    showStack: true
