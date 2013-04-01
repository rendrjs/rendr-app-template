module.exports = {
  index: function(params, callback) {
    var spec = {
      collection: {collection: 'Repos', params: params}
    };
    this.app.fetch(spec, function(err, result) {
      callback(err, 'repos_index_view', result);
    });
  },

  show: function(params, callback) {
    var spec = {
      model: {model: 'Repo', params: params, ensureKeys: ['language', 'watchers_count']}
    };
    this.app.fetch(spec, function(err, result) {
      callback(err, 'repos_show_view', result);
    });
  }
};
