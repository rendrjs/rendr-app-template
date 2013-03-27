BaseClientRouter = require('rendr/client/router')

module.exports = class Router extends BaseClientRouter

  postInitialize: ->
    @on 'action:start', @trackImpression

  trackImpression: ->
    _gaq?.push(['_trackPageview'])
