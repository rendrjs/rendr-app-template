module.exports = {
  show: function(params, callback) {
    var fetchSpec = {
      model: {model: 'User', params: params},
      repos: {collection: 'Repos', params: {user: params.login}}
    };
    this.app.fetcher.fetch(fetchSpec, function(err, result) {
      callback(err, 'users_show_view', result);
    });
  }
};
