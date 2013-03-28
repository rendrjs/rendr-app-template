module.exports = {
  index: function(params, callback) {
    var fetchSpec = {
      collection: {collection: 'Repos', params: params}
    };
    this.app.fetcher.fetch(fetchSpec, function(err, result) {
      callback(err, 'home_index_view', result);
    });
  }
};
