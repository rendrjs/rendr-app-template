module.exports = {
  show: function(params, callback) {
    var fetchSpec = {
      model: {model: 'Repo', params: params}
    };
    this.app.fetcher.fetch(fetchSpec, function(err, result) {
      callback(err, 'repos_show_view', result);
    });
  }
};
