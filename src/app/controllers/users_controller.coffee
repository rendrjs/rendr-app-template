module.exports =
  index: (params, callback) ->
    spec = 
      collection:
        collection: 'Users'
        params: params

    this.app.fetch spec, (err, result) ->
      callback err, 'users_index_view', result
      return
    return

  show: (params, callback) ->
    spec = 
      model:
        model: 'User'
        params: params
      repos:
        collection: 'Repos'
        params:
          user: params.login


    this.app.fetch spec, (err, result) ->
      callback err, 'users_show_view', result
      return
    return
