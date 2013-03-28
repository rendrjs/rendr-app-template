RendrApp = require('rendr/shared/app')

handlebarsHelpers = require('./helpers/handlebars_helpers')
Handlebars.registerHelper(key, value) for own key, value of handlebarsHelpers

module.exports = class App extends RendrApp
  defaults:
    loading: false

  # @shared
  initialize: ->
    super

  # @client
  start: ->
    # Show the loading indicator when the app is fetching.
    @router.on 'action:start', => @set(loading: true)
    @router.on 'action:end',   => @set(loading: false)

    super
