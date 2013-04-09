BaseApp = require 'rendr/shared/app'

module.exports = BaseApp.extend
  defaults:
    loading: false

  # @client
  start: ->
    # Show a loading indicator when the app is fetching.
    this.router.on 'action:start', ->
      this.set
        loading: true
      return
    , this

    this.router.on 'action:end', ->
      this.set
        loading: false
      return
    , this

    # Call 'super'.
    BaseApp.prototype.start.call this
    return