BaseAppView = require 'rendr/shared/base/app_view'

$body = $ 'body'

module.exports = BaseAppView.extend
	postInitialize: ->
		this.app.on 'change:loading', (app, loading) ->
			$body.toggleClass 'loading', loading
			return
		, this
		return