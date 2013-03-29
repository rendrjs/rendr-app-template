module.exports = {
  index: function(params, callback) {
    var fetchSpec = {
      collection: {collection: 'Repos', params: params}
    };
    this.app.fetcher.fetch(fetchSpec, function(err, result) {
      callback(err, 'repos_index_view', result);
    });
  },

  show: function(params, callback) {
    var fetchSpec = {
      model: {model: 'Repo', params: params}
    };
    this.app.fetcher.fetch(fetchSpec, function(err, result) {
      callback(err, 'repos_show_view', result);
    });
  }
};
