module.exports =
  index: (params, callback) ->
    spec = 
      collection:
        collection: 'Repos'
        params: params

    this.app.fetch spec, (err, result) ->
      callback err, 'repos_index_view', result
      return
    return

  show: (params, callback) ->
    spec = 
      model:
        model: 'Repo'
        params: params
        ensureKeys: ['language', 'watchers_count']

    this.app.fetch spec, (err, result) ->
      callback err, 'repos_show_view', result
      return
    return