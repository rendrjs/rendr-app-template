#
# Config settings for NODE_ENV=production
#

exports.config =
  assets:
    minify: true
    cdn:
      protocol: 'https'
      cnames: [0,1,2,3].map((i) -> return "a" + i + ".muscache.com")
      pathPrefix: '/airbnb/moweb'
    fingerprint:
      enabled: true

  errorHandler: {}
