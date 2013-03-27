User = require('./user')

module.exports = class SessionManager extends Backbone.Model

  currentUser: null

  # @shared
  initialize: (attrs, options = {}) ->
    @options = options
    @app = @options.app

  # @shared
  loggedIn: ->
    !!@get('current_user')
