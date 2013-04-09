Repo = require '../models/repo'
Base = require './base'

module.exports = Base.extend
	model: Repo,
	url: ->
		if this.params.user
			'/users/:user/repos'
		else
			'/repositories'

module.exports.id = 'Repos'