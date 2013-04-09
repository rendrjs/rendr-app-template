BaseClientRouter = require 'rendr/client/router'

Router = module.exports = Router(options) ->
	BaseClientRouter.call this, options
	return

Router.prototype.__proto__ = BaseClientRouter.prototype

Router.prototype.postInitialize = ->
	this.on 'action:start',
		this.trackImpression,
		this
	return

Router.prototype.trackImpression = ->
	_gaq.push ['_trackPageview'] if window._gaq
	return
